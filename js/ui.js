/**
 * ui.js — toda a renderização e manipulação de DOM do jogo.
 * A lógica de jogo nunca deve mexer diretamente no DOM fora daqui.
 */

const UI = {
  buyQuantity: 1, // 1 | 10 | 100 | 'max'
  activeTab: 'jogar',
  els: {},

  init() {
    this.els = {
      regisValue: document.getElementById('regis-value'),
      cpsValue: document.getElementById('cps-value'),
      clickValue: document.getElementById('click-value'),
      comboDisplay: document.getElementById('combo-display'),
      buffsDisplay: document.getElementById('buffs-display'),
      regisButton: document.getElementById('regis-button'),
      clickPopups: document.getElementById('click-popups'),
      eventContainer: document.getElementById('event-entity-container'),
      panelProdutores: document.getElementById('panel-produtores'),
      tabUpgrades: document.getElementById('tab-upgrades'),
      tabPrestigio: document.getElementById('tab-prestigio'),
      tabConquistas: document.getElementById('tab-conquistas'),
      tabEstatisticas: document.getElementById('tab-estatisticas'),
      tabColecao: document.getElementById('tab-colecao'),
      tabDesafios: document.getElementById('tab-desafios'),
      tabConfiguracoes: document.getElementById('tab-configuracoes'),
      tabSaves: document.getElementById('tab-saves'),
      tooltip: document.getElementById('tooltip'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalContent: document.getElementById('modal-content'),
      buyQtyButtons: Utils.qsa('.buy-qty-btn')
    };

    this.bindStaticEvents();
    Notifications.init();
  },

  bindStaticEvents() {
    Utils.qsa('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    this.els.buyQtyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.buyQuantity = btn.dataset.qty === 'max' ? 'max' : parseInt(btn.dataset.qty, 10);
        this.els.buyQtyButtons.forEach(b => b.classList.toggle('active', b === btn));
        this.renderBuildings();
      });
    });

    document.body.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) this.showTooltip(target);
    });
    document.body.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (target) this.hideTooltip();
    });
    document.body.addEventListener('mousemove', (e) => {
      if (!this.els.tooltip.classList.contains('hidden')) {
        this.positionTooltip(e.clientX, e.clientY);
      }
    });

    this.els.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.els.modalOverlay) this.closeModal();
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    Utils.qsa('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    Utils.qsa('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tab}`));
    this.refreshAll();
  },

  refreshAll() {
    this.renderTopBar();
    this.renderBuildings();
    if (this.activeTab === 'upgrades') this.renderUpgrades();
    if (this.activeTab === 'prestigio') this.renderPrestige();
    if (this.activeTab === 'conquistas') this.renderAchievements();
    if (this.activeTab === 'estatisticas') this.renderStats();
    if (this.activeTab === 'colecao') this.renderCollectibles();
    if (this.activeTab === 'desafios') this.renderChallenges();
    if (this.activeTab === 'configuracoes') this.refreshSettings();
    if (this.activeTab === 'saves') this.renderSaves();
  },

  renderTopBar() {
    this.els.regisValue.textContent = formatNumber(StateGetters.regis());
    this.els.cpsValue.textContent = formatNumber(Economy.getTotalCps());
    this.els.clickValue.textContent = formatNumber(Economy.getClickValue());

    const combo = gameState.comboCount || 0;
    this.els.comboDisplay.innerHTML = combo >= 5 ? `<span class="combo-tag">COMBO x${combo}</span>` : '';

    this.renderBuffs();
  },

  renderBuffs() {
    const now = Date.now();
    const buffs = (gameState.activeBuffs || []).filter(b => b.endsAt > now);
    if (buffs.length === 0) {
      this.els.buffsDisplay.innerHTML = '';
      return;
    }
    this.els.buffsDisplay.innerHTML = `
      <div class="buffs-title">BUFFS ATIVOS</div>
      ${buffs.map(b => {
        const secondsLeft = Math.ceil((b.endsAt - now) / 1000);
        const label = b.type === 'production_penalty'
          ? `x${b.value.toFixed(2)} Produção`
          : `x${b.value} ${b.type === 'click_mult' ? 'Clique' : 'Produção'}`;
        return `<div class="buff-row"><span>${b.icon} ${label}</span><span>${secondsLeft}s</span></div>`;
      }).join('')}
    `;
  },

  /* ---------------- PRODUTORES ---------------- */

  renderBuildings() {
    if (!this.els.panelProdutores) return;
    const regis = StateGetters.regis();
    const html = BUILDINGS_DATA.filter(b => BuildingsLogic.isUnlocked(b.id)).map(b => {
      const owned = StateGetters.buildingOwned(b.id);
      const qty = this.buyQuantity === 'max' ? Economy.getMaxAffordable(b.id) : this.buyQuantity;
      const cost = this.buyQuantity === 'max'
        ? Economy.getBuildingBulkCost(b.id, Math.max(qty, 1))
        : Economy.getBuildingBulkCost(b.id, this.buyQuantity);
      const affordable = regis.gte(cost) && qty > 0;
      const perSecond = Economy.getBuildingProductionPerSecond(b.id);
      const tooltip = encodeURIComponent(JSON.stringify({
        kind: 'building',
        name: b.name,
        lore: b.lore,
        owned,
        perUnit: formatNumber(Economy.getBuildingBaseProduction(b.id).mul(Decimal.fromNumber(Economy.getBuildingMultiplier(b.id)))),
        totalProd: formatNumber(perSecond),
        nextCost: formatNumber(Economy.getBuildingCost(b.id))
      }));

      return `
        <button class="building-row ${affordable ? '' : 'disabled'}" data-action="buy-building" data-id="${b.id}" data-tooltip="${tooltip}" ${affordable ? '' : 'disabled'}>
          <span class="building-icon">${b.icon}</span>
          <span class="building-info">
            <span class="building-name">${b.name} <span class="building-owned">(${owned})</span></span>
            <span class="building-sub">${formatNumber(perSecond)} Régis/s</span>
          </span>
          <span class="building-cost">${formatNumber(cost)}</span>
        </button>
      `;
    }).join('');
    this.els.panelProdutores.innerHTML = html || '<p class="empty-hint">Clique no Régis para começar!</p>';
  },

  /* ---------------- UPGRADES ---------------- */

  renderUpgrades() {
    const available = UpgradesLogic.getAvailableUpgrades();
    const categories = {};
    available.forEach(u => {
      if (!categories[u.category]) categories[u.category] = [];
      categories[u.category].push(u);
    });

    const CATEGORY_LABELS = {
      clique: 'Upgrades de Clique',
      combo: 'Upgrades de Combo',
      producao: 'Multiplicadores Globais',
      producao_produtor: 'Upgrades de Produtores',
      offline: 'Upgrades Offline',
      eventos: 'Upgrades de Eventos',
      secreto: 'Upgrades Secretos',
      prestigio: 'Upgrades de Prestígio'
    };

    if (available.length === 0) {
      this.els.tabUpgrades.innerHTML = '<p class="empty-hint">Nenhum upgrade disponível ainda. Continue produzindo Régis!</p>';
      return;
    }

    this.els.tabUpgrades.innerHTML = Object.keys(categories).map(cat => `
      <div class="upgrade-category">
        <h3>${CATEGORY_LABELS[cat] || cat}</h3>
        <div class="upgrade-grid">
          ${categories[cat].map(u => this.renderUpgradeCard(u)).join('')}
        </div>
      </div>
    `).join('');
  },

  renderUpgradeCard(u) {
    const bought = !!gameState.upgradesBought[u.id];
    const affordable = StateGetters.regis().gte(Decimal.fromString(u.cost));
    const tooltip = encodeURIComponent(JSON.stringify({
      kind: 'upgrade',
      name: u.name,
      description: u.description,
      lore: u.lore
    }));
    return `
      <button class="upgrade-card ${bought ? 'bought' : ''} ${affordable || bought ? '' : 'disabled'}"
        data-action="buy-upgrade" data-id="${u.id}" data-tooltip="${tooltip}" ${bought || !affordable ? 'disabled' : ''}>
        <span class="upgrade-icon">${u.icon}</span>
        <span class="upgrade-name">${u.name}</span>
        ${bought ? '<span class="upgrade-bought-tag">✔ Comprado</span>' : `<span class="upgrade-cost">${formatNumber(Decimal.fromString(u.cost))}</span>`}
      </button>
    `;
  },

  /* ---------------- PRESTÍGIO ---------------- */

  renderPrestige() {
    const gain = PrestigeLogic.calculateCelestialGain();
    const canAscend = gain.gt(Decimal.ZERO);
    this.els.tabPrestigio.innerHTML = `
      <div class="prestige-header">
        <h2>Ascensão</h2>
        <p>Régis Celestiais: <strong>${formatNumber(StateGetters.celestial())}</strong></p>
        <p>Nível de Prestígio: <strong>${gameState.prestige.ascensions}</strong></p>
        <div class="prestige-gain-box">
          ${canAscend
            ? `<p>Você receberá: <strong>+${formatNumber(gain)} ${PRESTIGE_CONFIG.currencyNamePlural}</strong></p>
               <button id="btn-ascend" class="btn-primary">ASCENDER</button>`
            : `<p>Produza mais Régis para poder ascender. (Meta atual: ${formatNumber(Decimal.fromNumber(PRESTIGE_CONFIG.divisor))} Régis totais)</p>`
          }
        </div>
      </div>
      <h3>Árvore de Prestígio</h3>
      <div id="prestige-tree" class="prestige-tree"></div>
    `;

    const btn = document.getElementById('btn-ascend');
    if (btn) btn.addEventListener('click', () => this.confirmAscend());

    this.renderPrestigeTree();
  },

  renderPrestigeTree() {
    const container = document.getElementById('prestige-tree');
    if (!container) return;
    const maxLevel = Math.max(...PRESTIGE_TREE_DATA.map(n => n.position.y)) + 1;
    container.style.height = `${maxLevel * 110 + 60}px`;

    const nodesHtml = PRESTIGE_TREE_DATA.map(node => {
      const bought = !!gameState.prestige.permanentUpgrades[node.id];
      const unlocked = PrestigeLogic.isNodeUnlocked(node.id);
      const affordable = StateGetters.celestial().gte(Decimal.fromNumber(node.cost));
      const tooltip = encodeURIComponent(JSON.stringify({
        kind: 'prestige',
        name: node.name,
        description: node.description,
        cost: node.cost
      }));
      return `
        <button class="prestige-node ${bought ? 'bought' : ''} ${!unlocked ? 'locked' : ''} ${unlocked && !bought && !affordable ? 'disabled' : ''}"
          style="left:${node.position.x}%; top:${node.position.y * 110}px;"
          data-action="buy-prestige-node" data-id="${node.id}" data-tooltip="${tooltip}"
          ${bought || !unlocked ? (bought ? 'disabled' : 'disabled') : ''}>
          <span class="prestige-icon">${unlocked ? node.icon : '❓'}</span>
          <span class="prestige-node-name">${unlocked ? node.name : '???'}</span>
          ${!bought ? `<span class="prestige-node-cost">${node.cost} 🌠</span>` : '<span class="prestige-node-cost">✔</span>'}
        </button>
      `;
    }).join('');

    const linesHtml = PRESTIGE_TREE_DATA.flatMap(node =>
      node.requires.map(reqId => {
        const parent = PRESTIGE_TREE_DATA.find(n => n.id === reqId);
        if (!parent) return '';
        return `<line x1="${parent.position.x}%" y1="${parent.position.y * 110 + 30}" x2="${node.position.x}%" y2="${node.position.y * 110 + 30}" />`;
      })
    ).join('');

    container.innerHTML = `<svg class="prestige-lines">${linesHtml}</svg>${nodesHtml}`;
  },

  confirmAscend() {
    const gain = PrestigeLogic.calculateCelestialGain();
    this.openModal(`
      <h2>Ascensão Disponível</h2>
      <p>Você receberá: <strong>+${formatNumber(gain)} ${PRESTIGE_CONFIG.currencyNamePlural}</strong></p>
      <p>Ao ascender, você perderá seu Régis atual, produtores e upgrades temporários. Upgrades permanentes de prestígio são mantidos.</p>
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-cancel">CANCELAR</button>
        <button class="btn-primary" id="modal-confirm-ascend">ASCENDER</button>
      </div>
    `);
    document.getElementById('modal-cancel').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-confirm-ascend').addEventListener('click', () => {
      PrestigeLogic.ascend();
      this.closeModal();
    });
  },

  /* ---------------- CONQUISTAS ---------------- */

  renderAchievements() {
    const total = ACHIEVEMENTS_DATA.length;
    const unlocked = Object.keys(gameState.achievementsUnlocked).length;
    this.els.tabConquistas.innerHTML = `
      <p class="achievements-summary">${unlocked} / ${total} conquistas desbloqueadas</p>
      <div class="achievements-grid">
        ${ACHIEVEMENTS_DATA.map(a => {
          const done = !!gameState.achievementsUnlocked[a.id];
          const hideSecret = a.category === 'secreto' && !done;
          return `
            <div class="achievement-card ${done ? 'done' : ''}" title="${done ? a.description : (hideSecret ? 'Conquista secreta' : a.description)}">
              <span class="achievement-icon">${done ? a.icon : '🔒'}</span>
              <span class="achievement-name">${hideSecret ? '???' : a.name}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  /* ---------------- ESTATÍSTICAS ---------------- */

  renderStats() {
    const s = gameState.stats;
    const rows = [
      ['Régis atual', formatNumber(StateGetters.regis())],
      ['Régis produzido no total', formatNumber(StateGetters.totalRegisEarned())],
      ['Régis produzido nesta ascensão', formatNumber(Decimal.from(gameState.totalRegisThisAscension))],
      ['Régis por segundo', formatNumber(Economy.getTotalCps())],
      ['Régis por clique', formatNumber(Economy.getClickValue())],
      ['Total de cliques', s.totalClicks.toLocaleString('pt-BR')],
      ['Tempo jogado', formatTime(s.playTimeSeconds)],
      ['Tempo offline computado', formatTime(s.offlineTimeSeconds)],
      ['Produtores no total', StateGetters.totalBuildingsOwned().toLocaleString('pt-BR')],
      ['Ascensões', s.totalAscensions],
      ['Régis Celestiais', formatNumber(StateGetters.celestial())],
      ['Achievements desbloqueados', `${Object.keys(gameState.achievementsUnlocked).length} / ${ACHIEVEMENTS_DATA.length}`],
      ['Upgrades comprados (total histórico)', s.totalUpgradesBought],
      ['Maior produção por segundo já vista', formatNumber(Decimal.from(s.maxCps))],
      ['Maior clique já registrado', formatNumber(Decimal.from(s.maxClick))],
      ['Maior combo', s.maxCombo],
      ['Régis Dourados clicados', s.goldenClicked],
      ['Eventos raros vistos', s.rareEventsClicked]
    ];
    this.els.tabEstatisticas.innerHTML = `
      <table class="stats-table">
        ${rows.map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`).join('')}
      </table>
    `;
  },

  /* ---------------- COLEÇÃO ---------------- */

  renderCollectibles() {
    this.els.tabColecao.innerHTML = `
      <p class="achievements-summary">${Object.keys(gameState.collectiblesUnlocked).length} / ${COLLECTIBLES_DATA.length} colecionáveis</p>
      <div class="achievements-grid">
        ${COLLECTIBLES_DATA.map(c => {
          const done = !!gameState.collectiblesUnlocked[c.id];
          return `
            <div class="achievement-card ${done ? 'done' : ''}">
              <span class="achievement-icon">${done ? c.icon : '🔒'}</span>
              <span class="achievement-name">${done ? c.name : '???'}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  /* ---------------- DESAFIOS ---------------- */

  renderChallenges() {
    this.els.tabDesafios.innerHTML = `
      <div class="challenge-list">
        ${CHALLENGES_DATA.map(c => {
          const state = gameState.challenges[c.id] || { completed: false };
          return `
            <div class="challenge-card ${state.completed ? 'done' : ''}">
              <span class="challenge-icon">${c.icon}</span>
              <div class="challenge-body">
                <h4>${c.name} ${state.completed ? '✔' : ''}</h4>
                <p>${c.description}</p>
                <p class="challenge-reward">Recompensa: ${c.reward}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  /* ---------------- CONFIGURAÇÕES ---------------- */

  refreshSettings() {
    if (!this.els.tabConfiguracoes) return;
    const s = gameState.settings;
    this.els.tabConfiguracoes.innerHTML = `
      <div class="settings-list">
        ${this.settingToggleHtml('sound', 'Som', s.sound)}
        ${this.settingToggleHtml('music', 'Música', s.music)}
        ${this.settingToggleHtml('animations', 'Animações', s.animations)}
        ${this.settingToggleHtml('compactNumbers', 'Números compactos', s.compactNumbers)}
        ${this.settingToggleHtml('highContrast', 'Modo de alto contraste', s.highContrast)}
        <div class="setting-row">
          <span>Tema</span>
          <div class="theme-buttons">
            <button class="btn-secondary ${s.theme === 'dark' ? 'active' : ''}" data-action="theme" data-theme="dark">Escuro</button>
            <button class="btn-secondary ${s.theme === 'light' ? 'active' : ''}" data-action="theme" data-theme="light">Claro</button>
          </div>
        </div>
      </div>
    `;
  },

  settingToggleHtml(key, label, value) {
    return `
      <div class="setting-row">
        <span>${label}</span>
        <button class="toggle-btn ${value ? 'on' : 'off'}" data-action="toggle-setting" data-key="${key}">${value ? 'ON' : 'OFF'}</button>
      </div>
    `;
  },

  /* ---------------- SAVES ---------------- */

  renderSaves() {
    this.els.tabSaves.innerHTML = `
      <div class="saves-panel">
        <h3>Exportar Save</h3>
        <p>Gere um código para guardar seu progresso ou transferi-lo para outro navegador.</p>
        <button id="btn-export" class="btn-primary">EXPORTAR SAVE</button>
        <textarea id="export-output" readonly placeholder="Seu código de save aparecerá aqui..."></textarea>

        <h3>Importar Save</h3>
        <p>Cole abaixo um código de save válido.</p>
        <textarea id="import-input" placeholder="Cole seu código de save aqui..."></textarea>
        <button id="btn-import" class="btn-primary">IMPORTAR SAVE</button>

        <h3>Zona de Perigo</h3>
        <button id="btn-reset" class="btn-danger">APAGAR PROGRESSO</button>
      </div>
    `;
    document.getElementById('btn-export').addEventListener('click', () => {
      const code = Save.exportSave();
      document.getElementById('export-output').value = code;
      Notifications.push('Save exportado com sucesso!', 'success');
    });
    document.getElementById('btn-import').addEventListener('click', () => {
      const code = document.getElementById('import-input').value;
      const result = Save.importSave(code);
      Notifications.push(result.success ? 'Save importado com sucesso!' : `Falha ao importar: ${result.reason}`, result.success ? 'success' : 'warning');
    });
    document.getElementById('btn-reset').addEventListener('click', () => this.confirmReset());
  },

  confirmReset() {
    this.openModal(`
      <h2>ATENÇÃO</h2>
      <p>Isso apagará TODO o seu progresso.</p>
      <p><strong>Essa ação não pode ser desfeita.</strong></p>
      <div class="modal-actions">
        <button class="btn-secondary" id="modal-cancel">CANCELAR</button>
        <button class="btn-danger" id="modal-confirm-reset">APAGAR TUDO</button>
      </div>
    `);
    document.getElementById('modal-cancel').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-confirm-reset').addEventListener('click', () => {
      Save.hardReset();
      this.closeModal();
      this.switchTab('jogar');
    });
  },

  /* ---------------- CLIQUE / FEEDBACK VISUAL ---------------- */

  spawnClickPopup(value, x, y) {
    if (!gameState.settings.animations) return;
    const popup = Utils.el('div', 'click-popup', `+${formatNumber(value)}`);
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    this.els.clickPopups.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
  },

  /* ---------------- EVENTOS (Régis Dourado) ---------------- */

  renderEventEntity(event) {
    this.els.eventContainer.innerHTML = `
      <button id="event-entity" class="event-entity" style="left:${event.x}%; top:${event.y}%;">
        ${event.data.icon}
      </button>
    `;
    document.getElementById('event-entity').addEventListener('click', () => EventsLogic.click());
  },

  clearEventEntity() {
    this.els.eventContainer.innerHTML = '';
  },

  /* ---------------- TOOLTIP ---------------- */

  showTooltip(target) {
    try {
      const data = JSON.parse(decodeURIComponent(target.dataset.tooltip));
      let html = `<strong>${data.name}</strong>`;
      if (data.kind === 'building') {
        html += `<br>${data.lore}<br><br>Produção: +${data.perUnit} Régis/s<br>Quantidade: ${data.owned}<br>Produção total: ${data.totalProd} Régis/s<br>Próximo custo: ${data.nextCost}`;
      } else if (data.kind === 'upgrade') {
        html += `<br>${data.description}<br><em>${data.lore || ''}</em>`;
      } else if (data.kind === 'prestige') {
        html += `<br>${data.description}<br>Custo: ${data.cost} 🌠`;
      }
      this.els.tooltip.innerHTML = html;
      this.els.tooltip.classList.remove('hidden');
    } catch (e) {
      // tooltip malformado não deve quebrar o jogo
    }
  },

  hideTooltip() {
    this.els.tooltip.classList.add('hidden');
  },

  positionTooltip(x, y) {
    const el = this.els.tooltip;
    const padding = 16;
    let left = x + padding;
    let top = y + padding;
    const rect = el.getBoundingClientRect();
    if (left + rect.width > window.innerWidth) left = x - rect.width - padding;
    if (top + rect.height > window.innerHeight) top = y - rect.height - padding;
    el.style.left = `${Math.max(0, left)}px`;
    el.style.top = `${Math.max(0, top)}px`;
  },

  /* ---------------- MODAL ---------------- */

  openModal(html) {
    this.els.modalContent.innerHTML = html;
    this.els.modalOverlay.classList.remove('hidden');
  },

  closeModal() {
    this.els.modalOverlay.classList.add('hidden');
    this.els.modalContent.innerHTML = '';
  },

  showOfflineModal(result) {
    this.openModal(`
      <h2>VOCÊ VOLTOU!</h2>
      <p>Enquanto você estava fora:</p>
      <p class="offline-time">${formatTime(result.elapsedSeconds)}</p>
      <p>Seus produtores geraram:</p>
      <p class="offline-earned">${formatNumber(result.earned)} Régis</p>
      <div class="modal-actions">
        <button class="btn-primary" id="modal-continue">CONTINUAR</button>
      </div>
    `);
    document.getElementById('modal-continue').addEventListener('click', () => this.closeModal());
  },

  showIntroModal() {
    this.openModal(`
      <h2>BEM-VINDO AO RÉGIS CLICKER</h2>
      <p>Tudo começou com um único Régis.</p>
      <p>Clique.</p>
      <p>Produza.</p>
      <p>Compre.</p>
      <p>E alcance números que não deveriam existir.</p>
      <div class="modal-actions">
        <button class="btn-primary" id="modal-start">COMEÇAR</button>
      </div>
    `);
    document.getElementById('modal-start').addEventListener('click', () => {
      gameState.flags.seenIntro = true;
      Save.save();
      this.closeModal();
    });
  }
};
