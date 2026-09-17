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
  }
};
