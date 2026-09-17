/**
 * data/content.js — colecionáveis, desafios e mensagens de sabor.
 */

const COLLECTIBLES_DATA = [
  { id: 'meme_regis_chorando', name: 'Meme: Régis Chorando', icon: '😭', unlock: { type: 'totalRegis', amount: 1000 } },
  { id: 'trofeu_bronze', name: 'Troféu de Bronze do Régis', icon: '🥉', unlock: { type: 'buildingsOwned', amount: 10 } },
  { id: 'trofeu_prata', name: 'Troféu de Prata do Régis', icon: '🥈', unlock: { type: 'buildingsOwned', amount: 100 } },
  { id: 'trofeu_ouro', name: 'Troféu de Ouro do Régis', icon: '🥇', unlock: { type: 'buildingsOwned', amount: 500 } },
  { id: 'relíquia_antiga', name: 'Relíquia Régisiana Antiga', icon: '🏺', unlock: { type: 'totalRegis', amount: 1e9 } },
  { id: 'foto_cliqueiro', name: 'Foto: O Primeiro Cliqueiro', icon: '📷', unlock: { type: 'buildingFirst', building: 'cliqueiro' } },
  { id: 'frase_motivacional_1', name: 'Frase: "Um clique de cada vez"', icon: '📝', unlock: { type: 'clicks', amount: 100 } },
  { id: 'frase_motivacional_2', name: 'Frase: "Régis não se faz sozinho. Ou se faz?"', icon: '📝', unlock: { type: 'clicks', amount: 10000 } },
  { id: 'item_secreto_1', name: 'Item Secreto: Chapéu de Régis', icon: '🎩', unlock: { type: 'ascensions', amount: 1 } },
  { id: 'item_secreto_2', name: 'Item Secreto: Óculos de Régis', icon: '🕶️', unlock: { type: 'ascensions', amount: 5 } },
  { id: 'medalha_dourada', name: 'Medalha do Régis Dourado', icon: '🎖️', unlock: { type: 'goldenClicked', amount: 25 } },
  { id: 'medalha_cosmica', name: 'Medalha Cósmica', icon: '🌠', unlock: { type: 'manual', key: 'foundCosmic' } },
  { id: 'estatua_mini', name: 'Miniestátua de Régis', icon: '🗿', unlock: { type: 'totalRegis', amount: 1e15 } },
  { id: 'coroa_regisiana', name: 'Coroa Régisiana', icon: '👑', unlock: { type: 'ascensions', amount: 25 } },
  { id: 'carta_misteriosa', name: 'Carta Misteriosa Não Assinada', icon: '✉️', unlock: { type: 'manual', key: 'foundKonami' } },
  { id: 'selo_lendario', name: 'Selo Lendário do Régis', icon: '🏵️', unlock: { type: 'totalRegis', amount: 1e30 } }
];

const CHALLENGES_DATA = [
  {
    id: 'desafio_zero_produtores',
    name: 'Modo Zero Clique... Digo, Produtor',
    description: 'Alcance 100.000 Régis totais sem comprar nenhum produtor.',
    icon: '🚫',
    condition: { type: 'noBuildingsReachRegis', amount: 100000 },
    reward: 'Conquista especial + título "Autossuficiente"'
  },
  {
    id: 'desafio_500_cliques_60s',
    name: 'Modo Produção Manual',
    description: 'Dê 500 cliques em menos de 60 segundos.',
    icon: '⏱️',
    condition: { type: 'clicksInWindow', amount: 500, windowSeconds: 60 },
    reward: 'Conquista especial + bônus temporário de clique'
  },
  {
    id: 'desafio_cps_alto',
    name: 'Modo Caos',
    description: 'Alcance uma produção de 1 milhão de Régis por segundo.',
    icon: '🌪️',
    condition: { type: 'cpsAtLeast', amount: 1e6 },
    reward: 'Conquista especial'
  },
  {
    id: 'desafio_ascender_rapido',
    name: 'Modo Tempo Limitado',
    description: 'Ascenda pela primeira vez em menos de 30 minutos de jogo.',
    icon: '⏳',
    condition: { type: 'ascendBeforeSeconds', amount: 1800 },
    reward: 'Conquista especial'
  },
  {
    id: 'desafio_sem_upgrades',
    name: 'Modo Minimalista',
    description: 'Alcance 1 milhão de Régis totais sem comprar upgrades.',
    icon: '🧘',
    condition: { type: 'noUpgradesReachRegis', amount: 1e6 },
    reward: 'Conquista especial'
  },
  {
    id: 'desafio_maratonista',
    name: 'Modo Maratona',
    description: 'Jogue por 5 horas no total (tempo ativo + offline).',
    icon: '🏃',
    condition: { type: 'playSecondsTotal', amount: 18000 },
    reward: 'Conquista especial'
  }
];

const FLAVOR_MESSAGES = [
  'Régis aprovado.',
  'Régis detectado.',
  'Régis aumentando.',
  'Isso já passou do normal.',
  'Alguém deveria parar isso.',
  'Os Régis estão se multiplicando.',
  'A produção nunca foi tão Régis.',
  'Continue. O Régis exige.',
  'Um Régis a mais nunca fez mal a ninguém.',
  'Isso definitivamente não é saudável.',
  'Os cientistas ainda não entendem o Régis.',
  'O Régis observa.',
  'Mais um clique. Mais um Régis.',
  'A economia do Régis está instável (de novo).',
  'Régis: agora em escala industrial.',
  'Ninguém pediu isso, mas aqui está.',
  'O Régis não dorme.',
  'Produção Régisiana em alta.',
  'Um pequeno passo para você, um grande passo para o Régis.',
  'Isso é oficialmente fora de controle.',
  'O Concílio de Régis aprova seu progresso.',
  'Mais Régis. Sempre mais Régis.',
  'A física local começa a questionar seus métodos.',
  'Seu clique ecoa por dimensões desconhecidas.',
  'Régis: um recurso, infinitas possibilidades.',
  'A galáxia observa seu progresso com Régis.',
  'Alguém, em algum lugar, está orgulhoso de você.',
  'Ninguém sabe o limite do Régis. Talvez não exista.',
  'A produção de Régis já ultrapassou toda lógica.',
  'Isso vai ficar na história. Da Régisologia.',
  'Seu Cliqueiro está exausto, mas orgulhoso.',
  'Os Régis Celestiais sussurram seu nome.',
  'Uma nova era do Régis se aproxima.',
  'Isso é claramente ciência de ponta.',
  'O Régis Dourado sente sua presença.',
  'A cada clique, uma nova pergunta sem resposta.',
  'O universo do Régis se expande.',
  'Régis. Régis. Régis.',
  'Continue clicando. É basicamente terapia.',
  'Seus produtores agradecem (provavelmente).',
  'Ninguém consegue explicar o Régis. Só produzir mais.'
];
