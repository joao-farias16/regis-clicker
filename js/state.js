/**
 * state.js — estado central do jogo (gameState).
 * Tudo que precisa ser salvo mora aqui.
 */

// v1 → v2: adiciona produtores transcendentais, upgrades/conquistas/prestígio
// expandidos, nível celestial infinito e metadados de conta. Todos os campos
// novos recebem valores padrão via ensureStateIntegrity(), então saves v1
// continuam carregando normalmente — nada é perdido.
const SAVE_VERSION = 2;

function createDefaultState() {
  return {
    saveVersion: SAVE_VERSION,

    // recurso principal
    regis: Decimal.ZERO.toJSON(),
    totalRegisEarned: Decimal.ZERO.toJSON(),       // total na vida toda (para prestígio)
    totalRegisThisAscension: Decimal.ZERO.toJSON(),

    // clique
    clicks: 0,
    clicksThisSession: 0,
    comboCount: 0,
    comboMax: 0,
    lastClickTime: 0,
    clickTimestamps: [],

    // produtores: { [buildingId]: { owned: number } }
    buildings: {},

    // upgrades compradas: { [upgradeId]: true }
    upgradesBought: {},

    // conquistas desbloqueadas: { [achievementId]: true }
    achievementsUnlocked: {},

    // colecionáveis: { [collectibleId]: true }
    collectiblesUnlocked: {},

    // desafios: { [challengeId]: { completed: bool, active: bool, startedAt: number } }
    challenges: {},

    // prestígio
    prestige: {
      celestial: Decimal.ZERO.toJSON(),
      ascensions: 0,
      permanentUpgrades: {}, // { [prestigeNodeId]: true }
      infiniteLevel: 0 // nível do upgrade celestial repetível (pós-árvore), progressão sem limite
    },

    // buffs ativos: [{ id, name, icon, type, value, endsAt, sourceEventId }]
    activeBuffs: [],

    // estatísticas internas
    stats: {
      totalClicks: 0,
      totalSpent: Decimal.ZERO.toJSON(),
      totalBuildingsBought: 0,
      totalUpgradesBought: 0,
      totalAchievements: 0,
      totalAscensions: 0,
      playTimeSeconds: 0,
      offlineTimeSeconds: 0,
      eventsClicked: 0,
      rareEventsClicked: 0,
      goldenClicked: 0,
      maxCps: Decimal.ZERO.toJSON(),
      maxClick: Decimal.ZERO.toJSON(),
      maxCombo: 0,
      gameStartedAt: Date.now(),
      lastSeenAt: Date.now(),
      totalCelestialEarned: Decimal.ZERO.toJSON() // lifetime, nunca decresce mesmo ao gastar celestiais
    },

    // flags diversos / segredos
    flags: {
      seenIntro: false,
      foundKonami: false,
      exportedSave: false,
      importedSave: false,
      foundCosmic: false,
      noBuildingsFlag: true, // vira false assim que compra o primeiro produtor
      boughtSynergyUpgrade: false,
      hasLoggedIn: false
    },

    // configurações
    settings: {
      sound: true,
      music: true,
      animations: true,
      compactNumbers: true,
      highContrast: false,
      theme: 'dark',
      fullscreen: false
    },

    // conta/login (v2) — nenhuma credencial é armazenada aqui, apenas metadados
    // de sincronização. O estado de autenticação em si vive em Auth.currentUser
    // (memória, nunca salvo em localStorage nem no save exportável).
    account: {
      linkedUid: null,
      lastCloudSyncAt: null
    },

    // metadados de tempo
    lastSaveTimestamp: Date.now()
  };
}

let gameState = createDefaultState();

/** Garante que produtores/estruturas novas existam mesmo em saves antigos migrados. */
/**
 * Garante que saves antigos (de versões anteriores do jogo) ganhem, de forma
 * segura, todos os campos novos introduzidos em atualizações posteriores —
 * sem jamais apagar o progresso existente. Sempre que um novo sistema for
 * adicionado ao gameState, seu valor padrão deve ser garantido aqui.
 */
function ensureStateIntegrity(state) {
  // novos produtores (ex.: os 8 produtores "transcendentais" da v2) em saves antigos
  BUILDINGS_DATA.forEach(b => {
    if (!state.buildings[b.id]) state.buildings[b.id] = { owned: 0 };
  });
  if (!state.prestige) state.prestige = { celestial: Decimal.ZERO.toJSON(), ascensions: 0, permanentUpgrades: {}, infiniteLevel: 0 };
  if (!state.prestige.permanentUpgrades) state.prestige.permanentUpgrades = {};
  if (typeof state.prestige.infiniteLevel !== 'number') state.prestige.infiniteLevel = 0;
  if (!state.totalRegisThisAscension) state.totalRegisThisAscension = state.regis || Decimal.ZERO.toJSON();
  if (!state.challenges) state.challenges = {};
  if (!state.collectiblesUnlocked) state.collectiblesUnlocked = {};
  if (!state.activeBuffs) state.activeBuffs = [];
  if (!state.flags) state.flags = createDefaultState().flags;
  if (!state.settings) state.settings = createDefaultState().settings;
  if (typeof state.settings.fullscreen !== 'boolean') state.settings.fullscreen = false;
  if (!state.stats) state.stats = createDefaultState().stats;
  if (!state.stats.totalCelestialEarned) state.stats.totalCelestialEarned = state.prestige.celestial || Decimal.ZERO.toJSON();
  if (typeof state.flags.boughtSynergyUpgrade !== 'boolean') state.flags.boughtSynergyUpgrade = false;
  if (typeof state.flags.hasLoggedIn !== 'boolean') state.flags.hasLoggedIn = false;
  // conta/login: nunca guardamos credenciais no save — apenas um identificador
  // de sincronização opcional, usado pelo Auth para saber se há nuvem vinculada.
  if (!state.account) state.account = { linkedUid: null, lastCloudSyncAt: null };
  return state;
}

/** Helpers de acesso rápido usando Decimal */
const StateGetters = {
  regis() { return Decimal.from(gameState.regis); },
  setRegis(dec) { gameState.regis = Decimal.from(dec).toJSON(); },
  addRegis(dec) {
    const added = Decimal.from(dec);
    gameState.regis = StateGetters.regis().add(added).toJSON();
    gameState.totalRegisEarned = Decimal.from(gameState.totalRegisEarned).add(added).toJSON();
    gameState.totalRegisThisAscension = Decimal.from(gameState.totalRegisThisAscension).add(added).toJSON();
  },
  spendRegis(dec) {
    const cost = Decimal.from(dec);
    if (StateGetters.regis().lt(cost)) return false;
    gameState.regis = StateGetters.regis().sub(cost).toJSON();
    gameState.stats.totalSpent = Decimal.from(gameState.stats.totalSpent).add(cost).toJSON();
    return true;
  },
  totalRegisEarned() { return Decimal.from(gameState.totalRegisEarned); },
  celestial() { return Decimal.from(gameState.prestige.celestial); },
  addCelestial(dec) {
    const added = Decimal.from(dec);
    gameState.prestige.celestial = StateGetters.celestial().add(added).toJSON();
    gameState.stats.totalCelestialEarned = Decimal.from(gameState.stats.totalCelestialEarned)
      .add(added).toJSON();
  },
  spendCelestial(dec) {
    const cost = Decimal.from(dec);
    if (StateGetters.celestial().lt(cost)) return false;
    gameState.prestige.celestial = StateGetters.celestial().sub(cost).toJSON();
    return true;
  },
  buildingOwned(id) { return gameState.buildings[id]?.owned || 0; },
  totalBuildingsOwned() {
    return Object.values(gameState.buildings).reduce((sum, b) => sum + (b.owned || 0), 0);
  }
};
