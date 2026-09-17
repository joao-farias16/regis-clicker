/**
 * prestige.js — lógica de ascensão e árvore celestial.
 */

const PrestigeLogic = {
  calculateCelestialGain(totalRegisOverride = null) {
    const total = totalRegisOverride ? Decimal.from(totalRegisOverride) : StateGetters.totalRegisEarned();
    const ratio = total.div(Decimal.fromNumber(PRESTIGE_CONFIG.divisor));
    if (ratio.lte(Decimal.ONE)) return Decimal.ZERO;
    // easeBonus reduz um pouco o expoente necessário (upgrade "Ascensão Facilitada")
    const easeBonus = Economy.sumEffect('prestige_ease') / 100;
    const root = PRESTIGE_CONFIG.root * (1 - easeBonus);
    const value = Math.pow(ratio.toNumber(), 1 / Math.max(root, 0.5));
    if (!isFinite(value)) {
      // números astronomicamente grandes: aproxima via logaritmo para não estourar
      const approxExponent = ratio.exponent / Math.max(root, 0.5);
      return Decimal.fromNumber(Math.pow(10, Math.min(approxExponent, 300)));
    }
    return Decimal.fromNumber(Math.floor(value));
  },

  canAscend() {
    return this.calculateCelestialGain().gt(Decimal.ZERO);
  },

  ascend() {
    const gain = this.calculateCelestialGain();
    if (gain.lte(Decimal.ZERO)) return { success: false, reason: 'insuficiente' };

    StateGetters.addCelestial(gain);
    gameState.prestige.ascensions++;
    gameState.stats.totalAscensions++;

    // reset do progresso "temporário"
    gameState.regis = Decimal.ZERO.toJSON();
    gameState.totalRegisThisAscension = Decimal.ZERO.toJSON();
    gameState.buildings = {};
    BUILDINGS_DATA.forEach(b => { gameState.buildings[b.id] = { owned: 0 }; });
    gameState.upgradesBought = {}; // upgrades normais são perdidas; permanentes continuam em prestige.permanentUpgrades
    gameState.activeBuffs = [];
    gameState.comboCount = 0;

    // bônus de início de vida de "Memória Ascendente"
    const startBonus = Economy.sumEffect('start_bonus');
    if (startBonus > 0) {
      StateGetters.addRegis(Decimal.fromNumber(startBonus));
    }

    AudioFX.play('ascend');
    Notifications.push(`Ascensão concluída! +${formatNumber(gain)} ${PRESTIGE_CONFIG.currencyNamePlural}`, 'ascend');
    AchievementsLogic.checkAll();
    UI.refreshAll();
    Save.save();
    return { success: true, gain };
  },

  isNodeUnlocked(nodeId) {
    if (gameState.prestige.permanentUpgrades[nodeId]) return true;
    const node = PRESTIGE_TREE_DATA.find(n => n.id === nodeId);
    if (!node) return false;
    return node.requires.every(reqId => gameState.prestige.permanentUpgrades[reqId]);
  },

  buyNode(nodeId) {
    const node = PRESTIGE_TREE_DATA.find(n => n.id === nodeId);
    if (!node) return { success: false, reason: 'inexistente' };
    if (gameState.prestige.permanentUpgrades[nodeId]) return { success: false, reason: 'já comprado' };
    if (!this.isNodeUnlocked(nodeId)) return { success: false, reason: 'bloqueado' };
    if (!StateGetters.spendCelestial(Decimal.fromNumber(node.cost))) {
      return { success: false, reason: 'insuficiente' };
    }
    gameState.prestige.permanentUpgrades[nodeId] = true;
    AudioFX.play('upgrade');
    Notifications.push(`Upgrade celestial adquirido: ${node.name}!`, 'upgrade');
    UI.refreshAll();
    Save.save();
    return { success: true };
  }
};
