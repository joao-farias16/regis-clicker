/**
 * state.js — estado central do jogo (gameState).
 * Tudo que precisa ser salvo mora aqui.
 */

const SAVE_VERSION = 1;

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
      permanentUpgrades: {} // { [prestigeNodeId]: true }
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
      lastSeenAt: Date.now()
    },

    // flags diversos / segredos
    flags: {
      seenIntro: false,
      foundKonami: false,
      exportedSave: false,
      importedSave: false,
      foundCosmic: false,
      noBuildingsFlag: true // vira false assim que compra o primeiro produtor
    },

    // configurações
    settings: {
      sound: true,
      music: true,
      animations: true,
      compactNumbers: true,
      highContrast: false,
      theme: 'dark'
    },

    // metadados de tempo
    lastSaveTimestamp: Date.now()
  };
}

let gameState = createDefaultState();

/** Garante que produtores/estruturas novas existam mesmo em saves antigos migrados. */
function ensureStateIntegrity(state) {
  BUILDINGS_DATA.forEach(b => {
    if (!state.buildings[b.id]) state.buildings[b.id] = { owned: 0 };
  });
  if (!state.prestige) state.prestige = { celestial: Decimal.ZERO.toJSON(), ascensions: 0, permanentUpgrades: {} };
  if (!state.prestige.permanentUpgrades) state.prestige.permanentUpgrades = {};
  if (!state.challenges) state.challenges = {};
  if (!state.collectiblesUnlocked) state.collectiblesUnlocked = {};
  if (!state.activeBuffs) state.activeBuffs = [];
  if (!state.flags) state.flags = createDefaultState().flags;
  if (!state.settings) state.settings = createDefaultState().settings;
  if (!state.stats) state.stats = createDefaultState().stats;
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
  addCelestial(dec) { gameState.prestige.celestial = StateGetters.celestial().add(Decimal.from(dec)).toJSON(); },
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
