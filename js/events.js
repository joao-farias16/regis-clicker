/**
 * events.js — lógica de eventos aleatórios (Régis Dourado e variantes).
 */

const EventsLogic = {
  currentEvent: null,     // { data, spawnedAt, x, y }
  nextEventCheckAt: 0,
  baseIntervalMin: 25,     // segundos
  baseIntervalMax: 70,

  scheduleNext() {
    const mult = Economy.getEventChanceMultiplier();
    const min = this.baseIntervalMin / mult;
    const max = this.baseIntervalMax / mult;
    this.nextEventCheckAt = Date.now() + Utils.randFloat(min, max) * 1000;
  },

  tick() {
    if (this.currentEvent) {
      const elapsed = (Date.now() - this.currentEvent.spawnedAt) / 1000;
      if (elapsed > this.currentEvent.data.lifetimeSeconds * Economy.getGoldenDurationMultiplier()) {
        this.dismissCurrent();
      }
      return;
    }
    if (Date.now() >= this.nextEventCheckAt) {
      this.spawn();
      this.scheduleNext();
    }
  },

  pickWeighted(list) {
    const totalWeight = list.reduce((s, e) => s + e.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const item of list) {
      if (roll < item.weight) return item;
      roll -= item.weight;
    }
    return list[list.length - 1];
  },

  spawn() {
    const eventDef = this.pickWeighted(EVENTS_DATA);
    this.currentEvent = {
      data: eventDef,
      spawnedAt: Date.now(),
      x: Utils.randFloat(10, 90),
      y: Utils.randFloat(15, 80)
    };
    UI.renderEventEntity(this.currentEvent);
  },

  dismissCurrent() {
    this.currentEvent = null;
    UI.clearEventEntity();
  },

  click() {
    if (!this.currentEvent) return;
    const eventDef = this.currentEvent.data;
    const rolled = this.pickWeighted(eventDef.rollEffects);
    this.applyEffect(rolled.effect, eventDef);

    gameState.stats.eventsClicked++;
    if (eventDef.rare) gameState.stats.rareEventsClicked++;
    if (eventDef.id === 'regis_dourado') gameState.stats.goldenClicked++;
    if (eventDef.id === 'regis_cosmico') gameState.flags.foundCosmic = true;

    const notificationText = rolled.text.replace(
      '{duration}',
      Math.round(rolled.effect.duration * Economy.getGoldenDurationMultiplier())
    );

    Notifications.push(notificationText, 'event');
    AudioFX.play('event');
    this.dismissCurrent();
    AchievementsLogic.checkAll();
    UI.refreshAll();
  },

  applyEffect(effect, eventDef) {
    if (effect.type === 'instant_regis') {
      const cps = Economy.getTotalCps(false);
      const gain = cps.mul(Decimal.fromNumber(effect.secondsWorth)).add(Decimal.fromNumber(100));
      StateGetters.addRegis(gain);
      return;
    }
    if (effect.type === 'production_mult' || effect.type === 'production_penalty' || effect.type === 'click_mult') {
      this.addBuff({
        id: Utils.uid(),
        name: eventDef.name,
        icon: eventDef.icon,
        type: effect.type,
        value: effect.value,
        durationMs: effect.duration * 1000 * Economy.getGoldenDurationMultiplier(),
        endsAt: Date.now() + effect.duration * 1000 * Economy.getGoldenDurationMultiplier()
      });
    }
  },

  addBuff(buff) {
    // sistema de combinação: se já existir um buff do mesmo "eixo" (produção ou clique),
    // combina em um COMBO ABSURDO em vez de simplesmente empilhar infinitamente
    const now = Date.now();
    const sameAxis = gameState.activeBuffs.find(b =>
      b.endsAt > now && (
        (buff.type === 'production_mult' && b.type === 'click_mult') ||
        (buff.type === 'click_mult' && b.type === 'production_mult')
      )
    );
    if (sameAxis) {
      Notifications.push(`${COMBINED_EVENT_NAME}! Os efeitos se combinaram!`, 'event');
    }
    gameState.activeBuffs.push(buff);
    // limpa buffs expirados para não acumular lixo
    gameState.activeBuffs = gameState.activeBuffs.filter(b => b.endsAt > now);
  },

  cleanExpiredBuffs() {
    const now = Date.now();
    gameState.activeBuffs = (gameState.activeBuffs || []).filter(b => b.endsAt > now);
  }
};
