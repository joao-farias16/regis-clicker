/**
 * firebase-config.js
 *
 * Preencha os campos abaixo com as credenciais do SEU projeto Firebase
 * (gratuito) para ativar login de verdade e sincronização de save em nuvem.
 *
 * SEM ISSO, O JOGO FUNCIONA NORMALMENTE em "modo convidado": tudo continua
 * salvando no localStorage exatamente como antes desta atualização. O login
 * é 100% opcional e aditivo — nunca é obrigatório para jogar.
 *
 * Como obter suas credenciais (gratuito, ~5 minutos):
 *   1. Acesse https://console.firebase.google.com e crie um projeto.
 *   2. No menu lateral, vá em "Build" → "Authentication" → "Get started" →
 *      ative o provedor "E-mail/senha".
 *   3. Vá em "Build" → "Firestore Database" → "Create database" → escolha
 *      "Start in production mode" (as regras de segurança ficam no README).
 *   4. Vá em "Project settings" (ícone de engrenagem) → role até "Your apps"
 *      → clique no ícone "</>" (Web) → registre um app (não precisa de
 *      Firebase Hosting) → copie o objeto "firebaseConfig" exibido e cole
 *      os valores abaixo.
 *
 * IMPORTANTE SOBRE SEGURANÇA: estas chaves (apiKey, authDomain, etc.) são
 * seguras para ficar no frontend — é assim que o Firebase é projetado para
 * funcionar, elas não são "senhas". A segurança real dos dados vem das
 * Regras de Segurança do Firestore (Firestore Rules), documentadas no
 * README.md, que garantem que cada jogador só possa ler/escrever o próprio
 * save. Nenhuma credencial de usuário (senha) passa por este arquivo — o
 * Firebase Auth cuida disso no lado do servidor.
 *
 * Se você hospedar na Vercel, adicione estes mesmos valores como variáveis
 * de ambiente e gere este arquivo no build, OU simplesmente preencha os
 * valores diretamente aqui antes do deploy (eles não são segredos).
 */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCItCNYMq3VHAwurhFRHCIjSZEf2YLK-dY',
  authDomain: 'regis-clicker.firebaseapp.com',
  projectId: 'regis-clicker',
  storageBucket: 'regis-clicker.firebasestorage.app',
  messagingSenderId: '644100411377',
  appId: '1:644100411377:web:17c16608fcb1d2e38dfe50'
};
