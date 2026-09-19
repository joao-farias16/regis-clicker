/**
 * prestige.js — lógica de ascensão e árvore celestial.
 */

const PrestigeLogic = {
  /**
   * Divisor efetivo da fórmula de prestígio: cresce geometricamente a cada
   * ascensão já concluída, exigindo progressivamente mais Régis (desde a
   * última ascensão) para o próximo ponto de Régis Celestial.
   */
  getEffectiveDivisor(ascensionsOverride = null) {
    const ascensions = ascensionsOverride ?? gameState.prestige.ascensions;
    const growth = Math.pow(PRESTIGE_CONFIG.divisorGrowth, ascensions);
    return PRESTIGE_CONFIG.divisor * growth;
  },

  /**
   * @param {Decimal|number|string|null} totalRegisOverride — se omitido, usa
   *   o Régis produzido *desde a última ascensão* (gameState.totalRegisThisAscension),
   *   e não o total vitalício. Isso é o que garante que uma nova ascensão
   *   exija progresso real, e não apenas alguns segundos extras de produção.
   */
  calculateCelestialGain(totalRegisOverride = null) {
    const total = totalRegisOverride !== null
      ? Decimal.from(totalRegisOverride)
      : Decimal.from(gameState.totalRegisThisAscension);
    const effectiveDivisor = this.getEffectiveDivisor();
    const ratio = total.div(Decimal.fromNumber(effectiveDivisor));
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
  },

  /* ---------------- Ressonância Celestial Infinita (repetível) ---------------- */

  getInfiniteLevel() {
    return gameState.prestige.infiniteLevel || 0;
  },

  isInfiniteUnlocked() {
    return !!gameState.prestige.permanentUpgrades[PRESTIGE_INFINITE_UPGRADE.requiresNodeId];
  },

  getInfiniteCost(levelOverride = null) {
    const level = levelOverride ?? this.getInfiniteLevel();
    const cost = PRESTIGE_INFINITE_UPGRADE.baseCost * Math.pow(PRESTIGE_INFINITE_UPGRADE.costGrowth, level);
    return Decimal.fromNumber(cost);
  },

  buyInfiniteLevel() {
    if (!this.isInfiniteUnlocked()) return { success: false, reason: 'bloqueado' };
    const cost = this.getInfiniteCost();
    if (!StateGetters.spendCelestial(cost)) return { success: false, reason: 'insuficiente' };
    gameState.prestige.infiniteLevel = this.getInfiniteLevel() + 1;
    AudioFX.play('upgrade');
    Notifications.push(`${PRESTIGE_INFINITE_UPGRADE.name} agora está no nível ${gameState.prestige.infiniteLevel}!`, 'upgrade');
    UI.refreshAll();
    Save.save();
    return { success: true };
  }
};
