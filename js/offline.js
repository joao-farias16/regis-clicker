/**
 * offline.js — cálculo de progresso offline.
 */

const OfflineLogic = {
  MAX_OFFLINE_SECONDS: 60 * 60 * 24 * 14, // trava de segurança: no máx. 14 dias contam

  process() {
    const last = gameState.stats.lastSeenAt || Date.now();
    const now = Date.now();
    let elapsedSeconds = Math.floor((now - last) / 1000);

    if (elapsedSeconds < 30) {
      gameState.stats.lastSeenAt = now;
      return null; // não vale a pena mostrar modal para ausências curtas
    }

    elapsedSeconds = Utils.clamp(elapsedSeconds, 0, this.MAX_OFFLINE_SECONDS);

    const cps = Economy.getTotalCps(false);
    const efficiency = Economy.getOfflineEfficiency();
    const earned = cps.mul(Decimal.fromNumber(elapsedSeconds)).mul(Decimal.fromNumber(efficiency));

    if (earned.gt(Decimal.ZERO)) {
      StateGetters.addRegis(earned);
    }

    gameState.stats.offlineTimeSeconds += elapsedSeconds;
    gameState.stats.lastSeenAt = now;

    return { elapsedSeconds, earned };
  }
};
