/**
 * save.js — salvamento, autosave, exportação e importação de save.
 */

const SAVE_KEY = 'regisClickerSave';
const SAVE_BACKUP_KEY = 'regisClickerSaveBackup';

const Save = {
  autosaveIntervalMs: 15000,
  _lastAutosave: 0,

  save() {
    try {
      gameState.lastSaveTimestamp = Date.now();
      gameState.stats.lastSeenAt = Date.now();
      const json = JSON.stringify(gameState);

      // mantém um backup do save anterior antes de sobrescrever
      const previous = Utils.safeLocalStorageGet(SAVE_KEY);
      if (previous) Utils.safeLocalStorageSet(SAVE_BACKUP_KEY, previous);

      Utils.safeLocalStorageSet(SAVE_KEY, json);
      return true;
    } catch (e) {
      console.error('Erro ao salvar:', e);
      return false;
    }
  },

  load() {
    const raw = Utils.safeLocalStorageGet(SAVE_KEY);
    if (!raw) return false;
    const parsed = this._tryParse(raw);
    if (parsed) {
      this._applyLoadedState(parsed);
      return true;
    }
    // save principal corrompido: tenta o backup
    const backupRaw = Utils.safeLocalStorageGet(SAVE_BACKUP_KEY);
    const backupParsed = backupRaw ? this._tryParse(backupRaw) : null;
    if (backupParsed) {
      Notifications.push('Seu save principal estava corrompido. Um backup recente foi recuperado.', 'warning');
      this._applyLoadedState(backupParsed);
      return true;
    }
    Notifications.push('Não foi possível carregar o save. Um novo jogo foi iniciado.', 'warning');
    return false;
  },

  _tryParse(raw) {
    try {
      const obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return null;
      return obj;
    } catch (e) {
      return null;
    }
  },

  _applyLoadedState(parsed) {
    const migrated = this.migrate(parsed);
    gameState = ensureStateIntegrity(Object.assign(createDefaultState(), migrated));
  },

  migrate(save) {
    let version = save.saveVersion || 0;
    // espaço reservado para futuras migrações de estrutura de save
    if (version < 1) {
      version = 1;
    }
    save.saveVersion = SAVE_VERSION;
    return save;
  },

  exportSave() {
    const json = JSON.stringify(gameState);
    const encoded = Utils.toBase64(json);
    gameState.flags.exportedSave = true;
    AchievementsLogic.checkAll();
    return encoded;
  },

  importSave(code) {
    if (!code || typeof code !== 'string') {
      return { success: false, reason: 'Código vazio.' };
    }
    const decoded = Utils.fromBase64(code.trim());
    if (!decoded) return { success: false, reason: 'Código inválido (não foi possível decodificar).' };
    const parsed = this._tryParse(decoded);
    if (!parsed) return { success: false, reason: 'Código inválido (JSON malformado).' };
    if (!('regis' in parsed) || !('buildings' in parsed)) {
      return { success: false, reason: 'Este código não parece ser um save válido do Régis Clicker.' };
    }
    this._applyLoadedState(parsed);
    gameState.flags.importedSave = true;
    Save.save();
    UI.refreshAll();
    AchievementsLogic.checkAll();
    return { success: true };
  },

  hardReset() {
    Utils.safeLocalStorageRemove(SAVE_KEY);
    Utils.safeLocalStorageRemove(SAVE_BACKUP_KEY);
    gameState = createDefaultState();
    BUILDINGS_DATA.forEach(b => { gameState.buildings[b.id] = { owned: 0 }; });
    UI.refreshAll();
  },

  tickAutosave() {
    const now = Date.now();
    if (now - this._lastAutosave >= this.autosaveIntervalMs) {
      this._lastAutosave = now;
      this.save();
    }
  }
};
