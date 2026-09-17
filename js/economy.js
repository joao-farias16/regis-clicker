/**
 * economy.js — sistema centralizado de cálculo de produção e clique.
 * Nenhum outro arquivo deve calcular CPS ou valor de clique "na unha":
 * tudo passa por aqui, para que multiplicadores nunca se percam ou dupliquem.
 */

const Economy = {

  /** Upgrades normais compradas (efeitos) */
  getActiveUpgradeEffects() {
    return UPGRADES_DATA
      .filter(u => gameState.upgradesBought[u.id])
      .map(u => u.effect);
  },

  /** Upgrades permanentes de prestígio compradas (efeitos) */
  getActivePrestigeEffects() {
    return PRESTIGE_TREE_DATA
      .filter(p => gameState.prestige.permanentUpgrades[p.id])
      .map(p => p.effect);
  },

  getAllEffects() {
    return [...this.getActiveUpgradeEffects(), ...this.getActivePrestigeEffects()];
  },

  /** Soma o campo "value" de todos os efeitos de um determinado tipo (e opcionalmente prédio específico) */
  sumEffect(type, buildingId = null) {
    let sum = 0;
    for (const eff of this.getAllEffects()) {
      if (eff.type !== type) continue;
      if (buildingId && eff.building && eff.building !== buildingId) continue;
      sum += eff.value;
    }
    return sum;
  },

  /** Bônus de "Leite de Régis": cada conquista desbloqueada dá um pequeno bônus global permanente */
  getMilkBonusMultiplier() {
    const count = Object.keys(gameState.achievementsUnlocked || {}).length;
    return 1 + count * 0.001; // 0,1% por conquista
  },

  getBuildingBaseProduction(buildingId) {
    const def = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!def) return Decimal.ZERO;
    return Decimal.fromNumber(def.baseProduction);
  },

  getBuildingMultiplier(buildingId) {
    const pct = this.sumEffect('building_mult', buildingId);
    return 1 + pct / 100;
  },

  /** Produção por segundo de UM tipo de produtor (já considerando quantidade e upgrades específicos) */
  getBuildingProductionPerSecond(buildingId) {
    const owned = StateGetters.buildingOwned(buildingId);
    if (owned <= 0) return Decimal.ZERO;
    const base = this.getBuildingBaseProduction(buildingId);
    const mult = this.getBuildingMultiplier(buildingId);
    return base.mul(Decimal.fromNumber(owned)).mul(Decimal.fromNumber(mult));
  },

  getGlobalProductionMultiplier() {
    const pctGlobal = this.sumEffect('global_mult');
    const pctAll = this.sumEffect('all_mult');
    const ascensionBonus = 1 + gameState.prestige.ascensions * 0.02; // +2% de produção por ascensão feita
    return (1 + pctGlobal / 100) * (1 + pctAll / 100) * ascensionBonus * this.getMilkBonusMultiplier();
  },

  /** Multiplicador multiplicativo de todos os buffs de produção ativos */
  getBuffProductionMultiplier() {
    let mult = 1;
    const now = Date.now();
    for (const buff of gameState.activeBuffs) {
      if (buff.endsAt < now) continue;
      if (buff.type === 'production_mult') mult *= buff.value;
      if (buff.type === 'production_penalty') mult *= buff.value;
    }
    return mult;
  },

  getBuffClickMultiplier() {
    let mult = 1;
    const now = Date.now();
    for (const buff of gameState.activeBuffs) {
      if (buff.endsAt < now) continue;
      if (buff.type === 'click_mult') mult *= buff.value;
    }
    return mult;
  },

  /**
   * CPS total (Régis por segundo).
   * @param {boolean} includeBuffs - se false, calcula CPS "base" sem buffs temporários (usado no offline progress e no debug).
   */
  getTotalCps(includeBuffs = true) {
    let total = Decimal.ZERO;
    for (const b of BUILDINGS_DATA) {
      total = total.add(this.getBuildingProductionPerSecond(b.id));
    }
    total = total.mul(Decimal.fromNumber(this.getGlobalProductionMultiplier()));
    if (includeBuffs) {
      total = total.mul(Decimal.fromNumber(this.getBuffProductionMultiplier()));
    }
    return total;
  },

  getClickBaseValue() {
    return 1 + this.sumEffect('click_add');
  },

  getClickMultiplierPercent() {
    return 1 + this.sumEffect('click_mult') / 100;
  },

  getClickFromCpsPercent() {
    return this.sumEffect('click_from_cps');
  },

  /** Bônus de combo: cresce em degraus conforme o combo atual, modificado por upgrades de combo */
  getComboBonusMultiplier() {
    const combo = gameState.comboCount || 0;
    let base = 0;
    if (combo >= 100) base = 0.5;
    else if (combo >= 50) base = 0.3;
    else if (combo >= 25) base = 0.18;
    else if (combo >= 10) base = 0.08;
    const comboUpgradeBonus = this.sumEffect('combo_mult') / 100;
    return 1 + base * (1 + comboUpgradeBonus);
  },

  /**
   * Valor de UM clique no Régis.
   * @param {boolean} includeBuffs
   */
  getClickValue(includeBuffs = true) {
    const cps = this.getTotalCps(false);
    const fromCpsPercent = this.getClickFromCpsPercent();
    let base = Decimal.fromNumber(this.getClickBaseValue())
      .add(cps.mul(Decimal.fromNumber(fromCpsPercent / 100)));

    base = base.mul(Decimal.fromNumber(this.getClickMultiplierPercent()));
    base = base.mul(Decimal.fromNumber(this.getComboBonusMultiplier()));
    base = base.mul(Decimal.fromNumber((1 + this.sumEffect('all_mult') / 100)));
    base = base.mul(Decimal.fromNumber(this.getMilkBonusMultiplier()));

    if (includeBuffs) {
      base = base.mul(Decimal.fromNumber(this.getBuffClickMultiplier()));
    }
    return base;
  },

  getEventChanceMultiplier() {
    return 1 + this.sumEffect('event_chance') / 100;
  },

  getGoldenDurationMultiplier() {
    return 1 + this.sumEffect('golden_duration') / 100;
  },

  /** Eficiência de produção offline: base 50%, pode chegar a 100% com upgrades */
  getOfflineEfficiency() {
    const base = 50;
    const bonus = this.sumEffect('offline_mult');
    return Utils.clamp(base + bonus, 0, 100) / 100;
  },

  /** Custo atual de um produtor (próxima unidade) */
  getBuildingCost(buildingId) {
    const def = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!def) return Decimal.ZERO;
    const owned = StateGetters.buildingOwned(buildingId);
    return Decimal.fromNumber(def.baseCost).mul(Decimal.fromNumber(Math.pow(def.costFactor, owned)));
  },

  /** Custo total para comprar `qty` unidades a partir da quantidade atual (soma da progressão geométrica) */
  getBuildingBulkCost(buildingId, qty) {
    const def = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!def) return Decimal.ZERO;
    const owned = StateGetters.buildingOwned(buildingId);
    const r = def.costFactor;
    // soma geométrica: custoBase * r^owned * (r^qty - 1) / (r - 1)
    const firstTerm = def.baseCost * Math.pow(r, owned);
    const factor = (Math.pow(r, qty) - 1) / (r - 1);
    return Decimal.fromNumber(firstTerm * factor);
  },

  /** Quantas unidades o jogador consegue comprar de um produtor com os Régis disponíveis */
  getMaxAffordable(buildingId, maxCheck = 100000) {
    const def = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!def) return 0;
    const owned = StateGetters.buildingOwned(buildingId);
    const r = def.costFactor;
    const available = StateGetters.regis().toNumber();
    if (!isFinite(available)) {
      // valores gigantes: faz busca binária usando Decimal para não perder precisão
      let lo = 0, hi = maxCheck;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi + 1) / 2);
        const cost = this.getBuildingBulkCost(buildingId, mid);
        if (cost.lte(StateGetters.regis())) lo = mid; else hi = mid - 1;
      }
      return lo;
    }
    // fórmula fechada para a soma geométrica <= available
    // available >= baseCost * r^owned * (r^n - 1)/(r-1)
    const k = available * (r - 1) / (def.baseCost * Math.pow(r, owned)) + 1;
    if (k <= 0) return 0;
    const n = Math.floor(Math.log(k) / Math.log(r));
    return Utils.clamp(n, 0, maxCheck);
  },

  /** Debug: detalha de onde vem o CPS atual (usado no painel de debug, requisito #76) */
  debugCpsBreakdown() {
    const baseSum = BUILDINGS_DATA.reduce((sum, b) => sum.add(this.getBuildingProductionPerSecond(b.id)), Decimal.ZERO);
    return {
      baseSum: formatNumber(baseSum),
      globalMult: this.getGlobalProductionMultiplier().toFixed(3),
      buffMult: this.getBuffProductionMultiplier().toFixed(3),
      finalCps: formatNumber(this.getTotalCps(true))
    };
  }
};
