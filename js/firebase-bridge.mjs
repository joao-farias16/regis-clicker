/**
 * firebase-bridge.mjs
 *
 * Módulo ES isolado responsável por carregar o SDK do Firebase via CDN
 * SOMENTE se `js/firebase-config.js` estiver preenchido, e expor uma API
 * simples em `window.FirebaseBridge` para o resto do jogo (que continua em
 * scripts clássicos, sem módulos) consumir.
 *
 * DECISÃO DE ARQUITETURA: por que Firebase, e por que assim?
 * O Régis Clicker é hospedado como site 100% estático (Vercel/Netlify/GitHub
 * Pages), sem servidor próprio. Um sistema de login "real" precisa de um
 * backend de autenticação em algum lugar. O Firebase Authentication +
 * Firestore é a opção que exige ZERO servidor próprio (funciona inteiramente
 * via chamadas do navegador para os servidores do Google), tem camada
 * gratuita generosa, e não quebra a hospedagem estática atual — por isso foi
 * escolhido em vez de montar um backend customizado.
 *
 * Este arquivo NUNCA usa top-level await e nunca lança para fora: se o
 * Firebase não estiver configurado, ou se o CDN estiver inacessível, o jogo
 * continua funcionando normalmente em modo convidado (apenas localStorage,
 * como antes desta atualização).
 */

const FIREBASE_SDK_VERSION = '10.12.2';
const CDN_BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;

function notifyStatus(detail) {
  document.dispatchEvent(new CustomEvent('firebase-status', { detail }));
}

async function init() {
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey) {
    window.FirebaseBridge = null;
    notifyStatus({ available: false, configured: false });
    return;
  }

  try {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import(/* webpackIgnore: true */ `${CDN_BASE}/firebase-app.js`),
      import(/* webpackIgnore: true */ `${CDN_BASE}/firebase-auth.js`),
      import(/* webpackIgnore: true */ `${CDN_BASE}/firebase-firestore.js`)
    ]);

    const app = initializeApp(cfg);
    const auth = authMod.getAuth(app);
    const db = fsMod.getFirestore(app);

    window.FirebaseBridge = {
      onAuthStateChanged(callback) {
        return authMod.onAuthStateChanged(auth, callback);
      },
      async signUp(email, password) {
        const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
        return cred.user;
      },
      async signIn(email, password) {
        const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
        return cred.user;
      },
      async signOutUser() {
        await authMod.signOut(auth);
      },
      async saveCloud(uid, dataObject) {
        await fsMod.setDoc(fsMod.doc(db, 'saves', uid), {
          data: dataObject,
          updatedAt: Date.now()
        });
      },
      async loadCloud(uid) {
        const snap = await fsMod.getDoc(fsMod.doc(db, 'saves', uid));
        return snap.exists() ? snap.data() : null;
      }
    };

    notifyStatus({ available: true, configured: true });
  } catch (e) {
    console.warn('[Régis Clicker] Firebase indisponível — continuando em modo convidado (apenas localStorage).', e);
    window.FirebaseBridge = null;
    notifyStatus({ available: false, configured: true, error: true });
  }
}

// dispara a inicialização sem bloquear o carregamento da página com um
// top-level await — o jogo deve estar jogável mesmo se isto nunca resolver.
init();
