/**
 * buildings.js — lógica de compra de produtores.
 */

const BuildingsLogic = {
  isUnlocked(buildingId) {
    const def = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!def) return false;
    const idx = BUILDINGS_DATA.findIndex(b => b.id === buildingId);
    // desbloqueio progressivo: o próximo produtor só aparece quando o anterior tem ao menos 1 unidade
    // (exceto o primeiro, sempre visível)
    if (idx === 0) return true;
    const prev = BUILDINGS_DATA[idx - 1];
    return StateGetters.buildingOwned(prev.id) > 0 || StateGetters.buildingOwned(buildingId) > 0;
  },

  buy(buildingId, quantity) {
    if (quantity === 'max') {
      quantity = Economy.getMaxAffordable(buildingId);
      if (quantity <= 0) return { success: false, reason: 'insuficiente' };
    }
    quantity = Math.floor(quantity);
    if (quantity <= 0) return { success: false, reason: 'quantidade inválida' };

    const cost = Economy.getBuildingBulkCost(buildingId, quantity);
    if (StateGetters.regis().lt(cost)) {
      return { success: false, reason: 'insuficiente' };
    }

    StateGetters.spendRegis(cost);
    if (!gameState.buildings[buildingId]) gameState.buildings[buildingId] = { owned: 0 };

    const wasFirst = gameState.buildings[buildingId].owned === 0;
    gameState.buildings[buildingId].owned += quantity;
    gameState.stats.totalBuildingsBought += quantity;
    gameState.flags.noBuildingsFlag = false;

    if (wasFirst) {
      Notifications.push(`Primeiro ${BUILDINGS_DATA.find(b => b.id === buildingId).name} adquirido!`, 'success');
      AchievementsLogic.checkAll();
    }

    AudioFX.play('buy');
    UI.refreshAll();
    AchievementsLogic.checkAll();
    return { success: true, quantity, cost };
  }
};
