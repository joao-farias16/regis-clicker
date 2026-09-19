/**
 * achievements.js — verificação e desbloqueio de conquistas.
 */

const AchievementsLogic = {
  isConditionMet(condition) {
    switch (condition.type) {
      case 'totalRegis':
        return StateGetters.totalRegisEarned().gte(Decimal.fromNumber(condition.amount));
      case 'clicks':
        return gameState.clicks >= condition.amount;
      case 'buildingsOwned':
        return StateGetters.totalBuildingsOwned() >= condition.amount;
      case 'buildingFirst':
        return StateGetters.buildingOwned(condition.building) > 0;
      case 'upgradesBought':
        return gameState.stats.totalUpgradesBought >= condition.amount;
      case 'ascensions':
        return gameState.prestige.ascensions >= condition.amount;
      case 'playSeconds':
        return gameState.stats.playTimeSeconds >= condition.amount;
      case 'goldenClicked':
        return gameState.stats.goldenClicked >= condition.amount;
      case 'rareEvents':
        return gameState.stats.rareEventsClicked >= condition.amount;
      case 'maxCombo':
        return gameState.stats.maxCombo >= condition.amount;
      case 'cpsAtLeast':
        return Economy.getTotalCps().gte(Decimal.fromNumber(condition.amount));
      case 'celestialEarned':
        return Decimal.from(gameState.stats.totalCelestialEarned || Decimal.ZERO.toJSON()).gte(Decimal.fromNumber(condition.amount));
      case 'infiniteLevel':
        return (gameState.prestige.infiniteLevel || 0) >= condition.amount;
      case 'anyBuildingAtLeast':
        return BUILDINGS_DATA.some(b => StateGetters.buildingOwned(b.id) >= condition.amount);
      case 'categoryOwned':
        return BUILDINGS_DATA.filter(b => b.category === condition.category)
          .every(b => StateGetters.buildingOwned(b.id) > 0);
      case 'allBuildingsOwned':
        return BUILDINGS_DATA.every(b => StateGetters.buildingOwned(b.id) > 0);
      case 'manual':
        return this.checkManual(condition.key);
      default:
        return false;
    }
  },

  checkManual(key) {
    switch (key) {
      case 'noBuildings1000':
        return gameState.flags.noBuildingsFlag && StateGetters.totalRegisEarned().gte(Decimal.fromNumber(1000));
      case 'clickBurst300':
        return this._clickBurstFlag === true;
      case 'lateNightPlay': {
        const h = new Date().getHours();
        return h >= 3 && h < 5;
      }
      case 'sixHoursSession':
        return this._sixHoursFlag === true;
      case 'foundKonami':
        return gameState.flags.foundKonami === true;
      case 'firstCollectible':
        return Object.keys(gameState.collectiblesUnlocked || {}).length >= 1;
      case 'allCollectibles':
        return Object.keys(gameState.collectiblesUnlocked || {}).length >= COLLECTIBLES_DATA.length;
      case 'firstChallenge':
        return Object.values(gameState.challenges || {}).some(c => c.completed);
      case 'allChallenges':
        return CHALLENGES_DATA.every(c => gameState.challenges[c.id]?.completed);
      case 'exportedSave':
        return gameState.flags.exportedSave === true;
      case 'importedSave':
        return gameState.flags.importedSave === true;
      case 'foundCosmic':
        return gameState.flags.foundCosmic === true;
      case 'prestigeTreeComplete':
        return PRESTIGE_TREE_DATA.every(n => gameState.prestige.permanentUpgrades[n.id]);
      case 'boughtSynergyUpgrade':
        return gameState.flags.boughtSynergyUpgrade === true;
      case 'loggedIn':
        return gameState.flags.hasLoggedIn === true;
      default:
        return false;
    }
  },

  checkAll() {
    let unlockedAny = false;
    for (const ach of ACHIEVEMENTS_DATA) {
      if (gameState.achievementsUnlocked[ach.id]) continue;
      if (this.isConditionMet(ach.condition)) {
        this.unlock(ach);
        unlockedAny = true;
      }
    }
    this.checkCollectibles();
    if (unlockedAny) UI.refreshAll();
  },

  unlock(ach) {
    gameState.achievementsUnlocked[ach.id] = true;
    gameState.stats.totalAchievements = Object.keys(gameState.achievementsUnlocked).length;
    AudioFX.play('achievement');
    Notifications.push(`Conquista desbloqueada: ${ach.name}!`, 'achievement');
  },

  checkCollectibles() {
    for (const col of COLLECTIBLES_DATA) {
      if (gameState.collectiblesUnlocked[col.id]) continue;
      if (this.isConditionMet(col.unlock)) {
        gameState.collectiblesUnlocked[col.id] = true;
        Notifications.push(`Novo colecionável: ${col.name}!`, 'success');
      }
    }
  }
};
