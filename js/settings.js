/**
 * settings.js — configurações do jogador.
 */

const SettingsLogic = {
  toggle(key) {
    if (!(key in gameState.settings)) return;
    gameState.settings[key] = !gameState.settings[key];
    this.apply();
    Save.save();
    UI.refreshSettings();
  },

  setTheme(theme) {
    gameState.settings.theme = theme;
    this.apply();
    Save.save();
    UI.refreshSettings();
  },

  apply() {
    document.body.classList.toggle('theme-light', gameState.settings.theme === 'light');
    document.body.classList.toggle('high-contrast', !!gameState.settings.highContrast);
    document.body.classList.toggle('no-animations', !gameState.settings.animations);
    AudioFX.setEnabled(gameState.settings.sound, gameState.settings.music);
  },

  /**
   * Tela cheia (v2) — melhora bastante a experiência em celulares.
   * Não é possível "lembrar" o modo tela cheia entre recarregamentos de
   * página (restrição de segurança dos navegadores: exige gesto do
   * usuário), então tratamos como uma ação, não como uma preferência
   * persistida — apenas o texto do botão reflete o estado atual.
   */
  isFullscreenSupported() {
    return !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  },

  isFullscreenActive() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  },

  async toggleFullscreen() {
    try {
      if (this.isFullscreenActive()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } else {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      }
    } catch (e) {
      // alguns navegadores (ex.: Safari iOS) bloqueiam tela cheia em certos
      // contextos — falha de forma silenciosa em vez de quebrar o jogo.
      Notifications.push('Este navegador não permite tela cheia neste momento.', 'warning');
    }
    UI.refreshSettings();
  }
};
