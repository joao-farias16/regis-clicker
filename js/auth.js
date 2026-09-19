/**
 * auth.js — sistema de login (v2).
 *
 * Estados possíveis (Auth.status):
 *  - 'idle'          → ainda inicializando, aguardando o bridge do Firebase
 *  - 'guest'          → jogando sem conta (Firebase não configurado, ou o
 *                       jogador optou por não entrar) — modo padrão e 100%
 *                       funcional, idêntico ao comportamento anterior a esta
 *                       atualização
 *  - 'loading'         → uma operação de login/cadastro está em andamento
 *  - 'authenticated'    → jogador autenticado com sucesso
 *  - 'error'           → última operação de login/cadastro falhou
 *
 * IMPORTANTE — preservação do save existente:
 * O localStorage continua sendo a fonte de verdade PRINCIPAL do progresso,
 * sempre. A nuvem é apenas um espelho best-effort: se autenticado, cada
 * Save.save() também tenta sincronizar para a nuvem (sem bloquear nem
 * atrasar o salvamento local), e nenhuma falha de rede aqui derruba o jogo.
 */

const Auth = {
  status: 'idle',
  currentUser: null,   // { uid, email } | null
  errorMessage: null,
  firebaseConfigured: false,

  init() {
    document.addEventListener('firebase-status', (e) => this._onBridgeStatus(e.detail));

    // caso o módulo do Firebase demore demais (ou nunca carregue, ex.: sem
    // internet), o jogo não pode ficar preso em "idle" — cai para convidado.
    setTimeout(() => {
      if (this.status === 'idle') {
        this.status = 'guest';
        UI.refreshSettings && UI.refreshSettings();
      }
    }, 5000);
  },

  _onBridgeStatus(detail) {
    this.firebaseConfigured = !!detail.configured;
    if (detail.available && window.FirebaseBridge) {
      window.FirebaseBridge.onAuthStateChanged((user) => this._onAuthStateChanged(user));
    } else {
      this.status = 'guest';
      UI.refreshSettings && UI.refreshSettings();
    }
  },

  async _onAuthStateChanged(firebaseUser) {
    if (firebaseUser) {
      this.currentUser = { uid: firebaseUser.uid, email: firebaseUser.email };
      this.status = 'authenticated';
      gameState.account.linkedUid = firebaseUser.uid;
      if (!gameState.flags.hasLoggedIn) {
        gameState.flags.hasLoggedIn = true;
        AchievementsLogic.checkAll();
      }
      await this._resolveCloudSync();
    } else {
      this.currentUser = null;
      this.status = 'guest';
      gameState.account.linkedUid = null;
    }
    UI.refreshSettings && UI.refreshSettings();
    Save.save();
  },

  /** Ao logar, decide o que fazer se já existir um save na nuvem para essa conta. */
  async _resolveCloudSync() {
    if (!window.FirebaseBridge || !this.currentUser) return;
    try {
      const cloud = await window.FirebaseBridge.loadCloud(this.currentUser.uid);
      if (cloud && cloud.data) {
        // Existem dois saves possíveis (local e nuvem): nunca escolhemos por
        // conta própria, para não arriscar sobrescrever progresso — o
        // jogador decide explicitamente.
        UI.showCloudSyncModal(cloud.data, cloud.updatedAt);
      } else {
        await this.pushCloudSave();
      }
    } catch (e) {
      console.warn('[Régis Clicker] Falha ao verificar save na nuvem:', e);
    }
  },

  /** Envia o estado atual para a nuvem. Nunca bloqueia nem quebra o save local. */
  async pushCloudSave() {
    if (!this.currentUser || !window.FirebaseBridge) return;
    try {
      await window.FirebaseBridge.saveCloud(this.currentUser.uid, gameState);
      gameState.account.lastCloudSyncAt = Date.now();
    } catch (e) {
      console.warn('[Régis Clicker] Falha ao sincronizar com a nuvem (o save local não foi afetado):', e);
    }
  },

  adoptCloudSave(cloudData) {
    Save._applyLoadedState(cloudData);
    Save.save();
    UI.refreshAll();
    Notifications.push('Save da nuvem carregado com sucesso.', 'success');
  },

  keepLocalSave() {
    this.pushCloudSave();
    Notifications.push('Mantendo seu save local. A nuvem foi atualizada com ele.', 'success');
  },

  async signUp(email, password) {
    if (!window.FirebaseBridge) return { success: false, reason: 'Login não está configurado neste jogo (veja README.md).' };
    this.status = 'loading';
    this.errorMessage = null;
    UI.refreshLoginModal && UI.refreshLoginModal();
    try {
      await window.FirebaseBridge.signUp(email, password);
      return { success: true };
    } catch (e) {
      this.status = 'error';
      this.errorMessage = this._friendlyError(e);
      UI.refreshLoginModal && UI.refreshLoginModal();
      return { success: false, reason: this.errorMessage };
    }
  },

  async signIn(email, password) {
    if (!window.FirebaseBridge) return { success: false, reason: 'Login não está configurado neste jogo (veja README.md).' };
    this.status = 'loading';
    this.errorMessage = null;
    UI.refreshLoginModal && UI.refreshLoginModal();
    try {
      await window.FirebaseBridge.signIn(email, password);
      return { success: true };
    } catch (e) {
      this.status = 'error';
      this.errorMessage = this._friendlyError(e);
      UI.refreshLoginModal && UI.refreshLoginModal();
      return { success: false, reason: this.errorMessage };
    }
  },

  async logout() {
    if (!window.FirebaseBridge) return;
    try {
      await window.FirebaseBridge.signOutUser();
      Notifications.push('Você saiu da sua conta. O jogo continua salvo localmente.', 'default');
    } catch (e) {
      Notifications.push('Não foi possível sair agora. Tente novamente.', 'warning');
    }
  },

  _friendlyError(e) {
    const code = e && e.code ? e.code : '';
    const map = {
      'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente entrar em vez de criar uma conta nova.',
      'auth/invalid-email': 'E-mail inválido.',
      'auth/weak-password': 'Senha muito curta (mínimo 6 caracteres).',
      'auth/user-not-found': 'Não existe conta com este e-mail.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco antes de tentar de novo.',
      'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.'
    };
    return map[code] || 'Não foi possível completar a operação. Tente novamente.';
  },

  openLoginModal() {
    this.status = this.status === 'authenticated' ? this.status : 'idle-form';
    this.errorMessage = null;
    UI.showLoginModal();
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
