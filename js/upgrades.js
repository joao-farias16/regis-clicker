/**
 * upgrades.js — lógica de desbloqueio e compra de upgrades.
 */

const UpgradesLogic = {
  isUnlockConditionMet(unlock) {
    if (!unlock || unlock.type === 'always') return true;
    switch (unlock.type) {
      case 'totalRegis':
        return StateGetters.totalRegisEarned().gte(Decimal.fromNumber(unlock.amount));
      case 'buildingCount':
        return StateGetters.buildingOwned(unlock.building) >= unlock.count;
      case 'clicks':
        return gameState.clicks >= unlock.amount;
      case 'ascensions':
        return gameState.prestige.ascensions >= unlock.amount;
      case 'cpsAtLeast':
        return Economy.getTotalCps().gte(Decimal.fromNumber(unlock.amount));
      default:
        return false;
    }
  },

  isVisible(upgrade) {
    if (gameState.upgradesBought[upgrade.id]) return true;
    if (upgrade.secret) {
      // upgrades secretos só aparecem quando MUITO perto de serem desbloqueáveis
      return this.isUnlockConditionMet(upgrade.unlock);
    }
    return this.isUnlockConditionMet(upgrade.unlock);
  },

  isAffordable(upgrade) {
    return StateGetters.regis().gte(Decimal.fromString(upgrade.cost));
  },

  buy(upgradeId) {
    const upgrade = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgrade) return { success: false, reason: 'inexistente' };
    if (gameState.upgradesBought[upgradeId]) return { success: false, reason: 'já comprado' };
    if (!this.isUnlockConditionMet(upgrade.unlock)) return { success: false, reason: 'bloqueado' };

    const cost = Decimal.fromString(upgrade.cost);
    if (StateGetters.regis().lt(cost)) return { success: false, reason: 'insuficiente' };

    StateGetters.spendRegis(cost);
    gameState.upgradesBought[upgradeId] = true;
    gameState.stats.totalUpgradesBought++;

    if (upgrade.effect && (upgrade.effect.type === 'synergy_mult')) {
      gameState.flags.boughtSynergyUpgrade = true;
    }

    AudioFX.play('upgrade');
    Notifications.push(`Upgrade desbloqueado: ${upgrade.name}!`, 'upgrade');
    UI.refreshAll();
    AchievementsLogic.checkAll();
    return { success: true };
  },

  getAvailableUpgrades() {
    return UPGRADES_DATA.filter(u => this.isVisible(u));
  }
};
