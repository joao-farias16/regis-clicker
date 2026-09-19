/**
 * main.js — inicialização do jogo, game loop e ligação de eventos.
 */

let DEBUG = false;

const Game = {
  lastFrameTime: 0,
  lastStatTick: 0,
  sessionStartTime: Date.now(),
  clickWindow: [], // timestamps para detectar combo e "clickBurst300"

  init() {
    UI.init();

    const loaded = Save.load();
    if (!loaded) {
      gameState = createDefaultState();
      BUILDINGS_DATA.forEach(b => { gameState.buildings[b.id] = { owned: 0 }; });
    }
    ensureStateIntegrity(gameState);

    SettingsLogic.apply();

    const offlineResult = OfflineLogic.process();
    if (offlineResult && offlineResult.earned.gt(Decimal.ZERO)) {
      UI.showOfflineModal(offlineResult);
    }

    if (!gameState.flags.seenIntro) {
      UI.showIntroModal();
    }

    this.bindEvents();
    EventsLogic.scheduleNext();
    UI.switchTab('jogar');
    UI.refreshAll();

    this.lastFrameTime = performance.now();
    this.sessionStartTime = Date.now();
    requestAnimationFrame(this.loop.bind(this));

    this.bindKonami();
    this.setupDebugConsole();
  },

  bindEvents() {
    document.getElementById('regis-button').addEventListener('click', (e) => this.handleClick(e));

    // delegação de eventos para toda a UI dinâmica
    document.body.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.dataset.action;

      switch (action) {
        case 'buy-building': {
          const qty = UI.buyQuantity === 'max' ? 'max' : UI.buyQuantity;
          BuildingsLogic.buy(actionEl.dataset.id, qty);
          break;
        }
        case 'buy-upgrade':
          UpgradesLogic.buy(actionEl.dataset.id);
          break;
        case 'buy-prestige-node':
          PrestigeLogic.buyNode(actionEl.dataset.id);
          UI.renderPrestige();
          break;
        case 'toggle-setting':
          SettingsLogic.toggle(actionEl.dataset.key);
          break;
        case 'theme':
          SettingsLogic.setTheme(actionEl.dataset.theme);
          break;
        case 'toggle-fullscreen':
          SettingsLogic.toggleFullscreen();
          break;
        case 'auth-login':
          Auth.openLoginModal();
          break;
        case 'auth-logout':
          Auth.logout();
          break;
      }
    });

    window.addEventListener('beforeunload', () => Save.save());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) Save.save();
      else {
        gameState.stats.lastSeenAt = Date.now();
      }
    });
  },

  handleClick(e) {
    const now = Date.now();

    // controle de combo
    this.clickWindow.push(now);
    this.clickWindow = this.clickWindow.filter(t => now - t < 60000);
    if (this._clickBurstTimeout) clearTimeout(this._clickBurstTimeout);
    if (this.clickWindow.filter(t => now - t < 60000).length >= 300) {
      AchievementsLogic._clickBurstFlag = true;
    }

    if (now - gameState.lastClickTime < 900) {
      gameState.comboCount++;
    } else {
      gameState.comboCount = 1;
    }
    gameState.lastClickTime = now;
    gameState.comboMax = Math.max(gameState.comboMax, gameState.comboCount);
    gameState.stats.maxCombo = Math.max(gameState.stats.maxCombo, gameState.comboCount);

    const value = Economy.getClickValue();
    StateGetters.addRegis(value);

    gameState.clicks++;
    gameState.clicksThisSession++;
    gameState.stats.totalClicks++;
    if (Decimal.from(gameState.stats.maxClick).lt(value)) {
      gameState.stats.maxClick = value.toJSON();
    }

    AudioFX.play('click');

    const rect = e.target.getBoundingClientRect();
    const parentRect = UI.els.clickPopups.getBoundingClientRect();
    const x = e.clientX - parentRect.left + Utils.randInt(-20, 20);
    const y = e.clientY - parentRect.top - 10;
    UI.spawnClickPopup(value, x, y);

    e.target.classList.add('clicked');
    setTimeout(() => e.target.classList.remove('clicked'), 100);

    AchievementsLogic.checkAll();
    this.checkChallenges();
    UI.renderTopBar();
    UI.renderBuildings();
  },

  checkChallenges() {
    for (const c of CHALLENGES_DATA) {
      if (!gameState.challenges[c.id]) gameState.challenges[c.id] = { completed: false };
      const state = gameState.challenges[c.id];
      if (state.completed) continue;

      let done = false;
      switch (c.condition.type) {
        case 'noBuildingsReachRegis':
          done = gameState.flags.noBuildingsFlag && StateGetters.totalRegisEarned().gte(Decimal.fromNumber(c.condition.amount));
          break;
        case 'clicksInWindow':
          done = this.clickWindow.filter(t => Date.now() - t < c.condition.windowSeconds * 1000).length >= c.condition.amount;
          break;
        case 'cpsAtLeast':
          done = Economy.getTotalCps().gte(Decimal.fromNumber(c.condition.amount));
          break;
        case 'ascendBeforeSeconds':
          done = gameState.prestige.ascensions >= 1 && gameState.stats.playTimeSeconds <= c.condition.amount;
          break;
        case 'noUpgradesReachRegis':
          done = gameState.stats.totalUpgradesBought === 0 && StateGetters.totalRegisEarned().gte(Decimal.fromNumber(c.condition.amount));
          break;
        case 'playSecondsTotal':
          done = (gameState.stats.playTimeSeconds + gameState.stats.offlineTimeSeconds) >= c.condition.amount;
          break;
      }
      if (done) {
        state.completed = true;
        Notifications.push(`Desafio concluído: ${c.name}!`, 'achievement');
      }
    }
  },

  loop(timestamp) {
    const deltaSeconds = Math.min((timestamp - this.lastFrameTime) / 1000, 1); // trava contra saltos grandes (aba em segundo plano)
    this.lastFrameTime = timestamp;

    // produção automática baseada em delta time real (requisito #37)
    const production = Economy.getTotalCps().mul(Decimal.fromNumber(deltaSeconds));
    if (production.gt(Decimal.ZERO)) StateGetters.addRegis(production);

    EventsLogic.tick();
    EventsLogic.cleanExpiredBuffs();

    this._statAccumulator = (this._statAccumulator || 0) + deltaSeconds;
    if (this._statAccumulator >= 1) {
      gameState.stats.playTimeSeconds += Math.floor(this._statAccumulator);
      this._statAccumulator -= Math.floor(this._statAccumulator);

      const cps = Economy.getTotalCps();
      if (Decimal.from(gameState.stats.maxCps).lt(cps)) gameState.stats.maxCps = cps.toJSON();

      if ((Date.now() - this.sessionStartTime) >= 6 * 3600 * 1000) {
        AchievementsLogic._sixHoursFlag = true;
      }

      UI.renderTopBar();
      if (['prestigio', 'estatisticas'].includes(UI.activeTab)) UI.refreshAll();
      AchievementsLogic.checkAll();
      this.checkChallenges();
    }

    Save.tickAutosave();
    requestAnimationFrame(this.loop.bind(this));
  },

  bindKonami() {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let progress = 0;
    document.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[progress]) {
        progress++;
        if (progress === sequence.length) {
          progress = 0;
          if (!gameState.flags.foundKonami) {
            gameState.flags.foundKonami = true;
            Notifications.push('Você encontrou um segredo! Régis agradece.', 'achievement');
            AchievementsLogic.checkAll();
          }
        }
      } else {
        progress = key === sequence[0] ? 1 : 0;
      }
    });
  },

  setupDebugConsole() {
    window.RegisDebug = {
      addRegis: (n) => StateGetters.addRegis(Decimal.fromString(String(n))),
      addCelestial: (n) => StateGetters.addCelestial(Decimal.fromString(String(n))),
      unlockAllUpgrades: () => { UPGRADES_DATA.forEach(u => gameState.upgradesBought[u.id] = true); UI.refreshAll(); },
      unlockAllAchievements: () => { ACHIEVEMENTS_DATA.forEach(a => gameState.achievementsUnlocked[a.id] = true); UI.refreshAll(); },
      forceEvent: (id) => {
        const def = EVENTS_DATA.find(e => e.id === id) || EVENTS_DATA[0];
        EventsLogic.currentEvent = { data: def, spawnedAt: Date.now(), x: 50, y: 50 };
        UI.renderEventEntity(EventsLogic.currentEvent);
      },
      resetSave: () => Save.hardReset(),
      cpsBreakdown: () => console.table(Economy.debugCpsBreakdown()),
      enable: () => { DEBUG = true; console.log('DEBUG ativado. Use window.RegisDebug.*'); },
      disable: () => { DEBUG = false; }
    };
  }
};

window.addEventListener('DOMContentLoaded', () => Game.init());
