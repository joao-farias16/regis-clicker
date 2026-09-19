/**
 * data/achievements.js — mais de 100 conquistas do Régis Clicker.
 * Cada conquista concede pequenos pontos de "Leite de Régis", que geram
 * um bônus global minúsculo e cumulativo de produção.
 *
 * condition.type: 'totalRegis' | 'clicks' | 'buildingsOwned' | 'buildingFirst'
 *                 | 'upgradesBought' | 'ascensions' | 'playSeconds'
 *                 | 'goldenClicked' | 'rareEvents' | 'maxCombo' | 'manual'
 */

function genThresholdAchievements(prefix, type, thresholds, nameFn, descFn) {
  return thresholds.map((t, i) => ({
    id: `${prefix}_${i}`,
    name: nameFn(t),
    description: descFn(t),
    icon: '🏅',
    category: prefix,
    condition: { type, amount: t }
  }));
}

const REGIS_TOTAL_THRESHOLDS = [
  1, 10, 100, 1000, 10000, 100000, 1e6, 1e7, 1e8, 1e9, 1e10, 1e12, 1e15,
  1e18, 1e21, 1e24, 1e27, 1e30, 1e40, 1e50, 1e75, 1e100
];
const CLICK_THRESHOLDS = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
const BUILDING_TOTAL_THRESHOLDS = [1, 10, 50, 100, 250, 500, 1000, 2500, 5000];
const UPGRADE_THRESHOLDS = [1, 5, 10, 25, 50, 100];
const ASCENSION_THRESHOLDS = [1, 2, 5, 10, 25, 50, 100];
const PLAYTIME_THRESHOLDS_MIN = [5, 30, 60, 180, 600, 1440];
const GOLDEN_THRESHOLDS = [1, 10, 50, 100];
const RARE_EVENT_THRESHOLDS = [1, 5, 20];
const COMBO_THRESHOLDS = [10, 25, 50, 100];
// v2 — novas categorias de conquistas
const CPS_THRESHOLDS = [10, 100, 1000, 1e4, 1e5, 1e6, 1e8, 1e10, 1e13, 1e16, 1e20];
const CELESTIAL_THRESHOLDS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
const INFINITE_LEVEL_THRESHOLDS = [1, 5, 10, 25, 50, 100];
const ANY_BUILDING_COUNT_THRESHOLDS = [100, 500, 1000, 2500];

const GENERATED_ACHIEVEMENTS = [
  ...genThresholdAchievements('regis_total', 'totalRegis', REGIS_TOTAL_THRESHOLDS,
    (t) => `${formatNumber(Decimal.fromNumber(t), { decimals: 0 })} Régis`,
    (t) => `Produza um total de ${formatNumber(Decimal.fromNumber(t), { decimals: 0 })} Régis na vida do jogo.`),

  ...genThresholdAchievements('cliques', 'clicks', CLICK_THRESHOLDS,
    (t) => `${t.toLocaleString('pt-BR')} cliques`,
    (t) => `Clique no Régis ${t.toLocaleString('pt-BR')} vezes.`),

  ...genThresholdAchievements('produtores', 'buildingsOwned', BUILDING_TOTAL_THRESHOLDS,
    (t) => `${t} produtores`,
    (t) => `Possua ${t} produtores no total, somando todos os tipos.`),

  ...genThresholdAchievements('upgrades', 'upgradesBought', UPGRADE_THRESHOLDS,
    (t) => `${t} upgrade${t > 1 ? 's' : ''} comprado${t > 1 ? 's' : ''}`,
    (t) => `Compre ${t} upgrade${t > 1 ? 's' : ''}.`),

  ...genThresholdAchievements('ascensao', 'ascensions', ASCENSION_THRESHOLDS,
    (t) => `${t}ª ascensão`,
    (t) => `Ascenda ${t} ${t > 1 ? 'vezes' : 'vez'}.`),

  ...genThresholdAchievements('tempo', 'playSeconds', PLAYTIME_THRESHOLDS_MIN.map(m => m * 60),
    (t) => `${formatTime(t)} jogados`,
    (t) => `Jogue por ${formatTime(t)} no total.`),

  ...genThresholdAchievements('dourado', 'goldenClicked', GOLDEN_THRESHOLDS,
    (t) => `${t} Régis Dourado${t > 1 ? 's' : ''}`,
    (t) => `Clique em ${t} Régis Dourado${t > 1 ? 's' : ''}.`),

  ...genThresholdAchievements('raro', 'rareEvents', RARE_EVENT_THRESHOLDS,
    (t) => `${t} evento${t > 1 ? 's' : ''} raro${t > 1 ? 's' : ''}`,
    (t) => `Presencie ${t} evento${t > 1 ? 's' : ''} raro${t > 1 ? 's' : ''}.`),

  ...genThresholdAchievements('combo', 'maxCombo', COMBO_THRESHOLDS,
    (t) => `Combo x${t}`,
    (t) => `Alcance um combo de cliques de x${t}.`),

  // primeira compra de cada produtor (inclui os 8 produtores transcendentais da v2)
  ...BUILDINGS_DATA.map((b, i) => ({
    id: `primeiro_${b.id}`,
    name: `Primeiro ${b.name}`,
    description: `Compre seu primeiro ${b.name}.`,
    icon: b.icon,
    category: 'buildingFirst',
    condition: { type: 'buildingFirst', building: b.id }
  })),

  ...genThresholdAchievements('cps', 'cpsAtLeast', CPS_THRESHOLDS,
    (t) => `${formatNumber(Decimal.fromNumber(t), { decimals: 0 })} Régis/s`,
    (t) => `Alcance uma produção de ${formatNumber(Decimal.fromNumber(t), { decimals: 0 })} Régis por segundo.`),

  ...genThresholdAchievements('celestial', 'celestialEarned', CELESTIAL_THRESHOLDS,
    (t) => `${t} Régis Celestiais`,
    (t) => `Acumule ${t} Régis Celestiais ao longo do jogo (mesmo que já tenha gasto parte deles).`),

  ...genThresholdAchievements('infinito', 'infiniteLevel', INFINITE_LEVEL_THRESHOLDS,
    (t) => `Ressonância nível ${t}`,
    (t) => `Alcance o nível ${t} da Ressonância Celestial Infinita.`),

  ...genThresholdAchievements('mestre_produtor', 'anyBuildingAtLeast', ANY_BUILDING_COUNT_THRESHOLDS,
    (t) => `${t} de um mesmo produtor`,
    (t) => `Possua ${t} unidades de um único tipo de produtor.`),

  // conquistas de conclusão por categoria de produtor
  ...Object.keys(BUILDING_CATEGORY_LABELS).map((cat) => ({
    id: `categoria_completa_${cat}`,
    name: `${BUILDING_CATEGORY_LABELS[cat]}: Completo`,
    description: `Possua ao menos 1 unidade de cada produtor da categoria "${BUILDING_CATEGORY_LABELS[cat]}".`,
    icon: '📦',
    category: 'categoria',
    condition: { type: 'categoryOwned', category: cat }
  }))
];

const HANDCRAFTED_ACHIEVEMENTS = [
  {
    id: 'inicio_de_tudo',
    name: 'O Início de Tudo',
    description: 'Clique no Régis pela primeira vez.',
    icon: '🌱',
    category: 'especial',
    condition: { type: 'clicks', amount: 1 }
  },
  {
    id: 'sem_ajuda',
    name: 'Sem Ajuda de Ninguém',
    description: 'Alcance 1.000 Régis sem comprar nenhum produtor.',
    icon: '🙅',
    category: 'secreto',
    condition: { type: 'manual', key: 'noBuildings1000' }
  },
  {
    id: 'clicador_obsessivo',
    name: 'Clicador Obsessivo',
    description: 'Dê 300 cliques em menos de 60 segundos.',
    icon: '🖱️',
    category: 'secreto',
    condition: { type: 'manual', key: 'clickBurst300' }
  },
  {
    id: 'madrugador',
    name: 'Madrugador do Régis',
    description: 'Jogue entre 3h e 5h da manhã.',
    icon: '🌃',
    category: 'secreto',
    condition: { type: 'manual', key: 'lateNightPlay' }
  },
  {
    id: 'paciencia_infinita',
    name: 'Paciência Infinita',
    description: 'Deixe o jogo aberto e rodando por 6 horas seguidas.',
    icon: '⏳',
    category: 'secreto',
    condition: { type: 'manual', key: 'sixHoursSession' }
  },
  {
    id: 'nome_do_jogador',
    name: 'Régis é Você',
    description: 'Encontre o segredo escondido no menu de configurações.',
    icon: '🕵️',
    category: 'secreto',
    condition: { type: 'manual', key: 'foundKonami' }
  },
  {
    id: 'primeira_ascensao',
    name: 'Além da Vida',
    description: 'Ascenda pela primeira vez e receba Régis Celestiais.',
    icon: '😇',
    category: 'prestigio',
    condition: { type: 'ascensions', amount: 1 }
  },
  {
    id: 'colecionador_iniciante',
    name: 'Colecionador Iniciante',
    description: 'Desbloqueie seu primeiro colecionável.',
    icon: '📦',
    category: 'colecao',
    condition: { type: 'manual', key: 'firstCollectible' }
  },
  {
    id: 'colecionador_completo',
    name: 'Colecionador Completo',
    description: 'Desbloqueie todos os colecionáveis.',
    icon: '🗃️',
    category: 'colecao',
    condition: { type: 'manual', key: 'allCollectibles' }
  },
  {
    id: 'desafiante',
    name: 'Aceito o Desafio',
    description: 'Complete seu primeiro desafio.',
    icon: '🎯',
    category: 'desafio',
    condition: { type: 'manual', key: 'firstChallenge' }
  },
  {
    id: 'mestre_dos_desafios',
    name: 'Mestre dos Desafios',
    description: 'Complete todos os desafios disponíveis.',
    icon: '🏆',
    category: 'desafio',
    condition: { type: 'manual', key: 'allChallenges' }
  },
  {
    id: 'exportador',
    name: 'Backup Consciente',
    description: 'Exporte seu save pela primeira vez.',
    icon: '💾',
    category: 'especial',
    condition: { type: 'manual', key: 'exportedSave' }
  },
  {
    id: 'importador',
    name: 'Recomeço Assistido',
    description: 'Importe um save pela primeira vez.',
    icon: '📥',
    category: 'especial',
    condition: { type: 'manual', key: 'importedSave' }
  },
  {
    id: 'sortudo',
    name: 'Sortudo',
    description: 'Encontre um Régis Cósmico, o evento mais raro do jogo.',
    icon: '🌠',
    category: 'secreto',
    condition: { type: 'manual', key: 'foundCosmic' }
  },
  {
    id: 'numeros_absurdos',
    name: 'Isso Já Passou do Normal',
    description: 'Alcance 1 undecilhão (1e36) de Régis totais.',
    icon: '💥',
    category: 'especial',
    condition: { type: 'totalRegis', amount: 1e36 }
  },

  /* ---------------- v2: expansão de conteúdo ---------------- */
  {
    id: 'colecionador_de_produtores',
    name: 'Um Pouco de Tudo',
    description: 'Possua ao menos 1 unidade de cada um dos 28 produtores existentes.',
    icon: '🧰',
    category: 'especial',
    condition: { type: 'allBuildingsOwned' }
  },
  {
    id: 'arvore_completa',
    name: 'Transcendido',
    description: 'Complete toda a árvore de upgrades permanentes de prestígio.',
    icon: '🌟',
    category: 'prestigio',
    condition: { type: 'manual', key: 'prestigeTreeComplete' }
  },
  {
    id: 'ressonancia_iniciada',
    name: 'Além da Árvore',
    description: 'Compre o primeiro nível da Ressonância Celestial Infinita.',
    icon: '♾️',
    category: 'prestigio',
    condition: { type: 'infiniteLevel', amount: 1 }
  },
  {
    id: 'sinergia_descoberta',
    name: 'Trabalho em Equipe',
    description: 'Compre um upgrade de sinergia entre produtores.',
    icon: '🔗',
    category: 'especial',
    condition: { type: 'manual', key: 'boughtSynergyUpgrade' }
  },
  {
    id: 'conta_criada',
    name: 'Identidade Régisiana',
    description: 'Crie uma conta ou faça login no Régis Clicker.',
    icon: '🪪',
    category: 'especial',
    condition: { type: 'manual', key: 'loggedIn' }
  },
  {
    id: 'produtor_transcendental',
    name: 'Além da Compreensão',
    description: 'Compre seu primeiro produtor da categoria Transcendental.',
    icon: '🌈',
    category: 'especial',
    condition: { type: 'categoryOwned', category: 'transcendental' }
  },
  {
    id: 'segunda_ascensao_dificil',
    name: 'A Segunda Vez é Pior',
    description: 'Complete sua segunda ascensão depois do rebalanceamento — prova de que valeu a pena reconstruir.',
    icon: '🔁',
    category: 'prestigio',
    condition: { type: 'ascensions', amount: 2 }
  }
];

const ACHIEVEMENTS_DATA = [...GENERATED_ACHIEVEMENTS, ...HANDCRAFTED_ACHIEVEMENTS];
