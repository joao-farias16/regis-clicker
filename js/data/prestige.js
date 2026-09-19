/**
 * data/prestige.js — Régis Celestiais e a árvore de prestígio.
 *
 * Fórmula de prestígio: celestiais = floor( (totalRegisVidaToda / 1e12) ^ (1/2.2) )
 * Configurável através de PRESTIGE_CONFIG.
 */

const PRESTIGE_CONFIG = {
  // ATENÇÃO — rebalanceamento (v2): o ganho de prestígio agora é calculado a
  // partir do Régis produzido *desde a última ascensão* (totalRegisThisAscension),
  // e não mais do total acumulado na vida toda do jogo. Isso corrige um exploit
  // em que era possível ascender repetidamente com ganhos marginais, já que o
  // total vitalício nunca reseta e qualquer produção residual bastava para
  // liberar uma nova ascensão. Veja PrestigeLogic.calculateCelestialGain().
  divisor: 1e12,
  // a cada ascensão já realizada, o divisor efetivo cresce por este fator,
  // tornando ascensões sucessivas progressivamente mais exigentes.
  divisorGrowth: 1.55,
  root: 2.2,
  currencyName: 'Régis Celestial',
  currencyNamePlural: 'Régis Celestiais'
};

/**
 * Árvore de upgrades permanentes, comprados com Régis Celestiais.
 * requires: lista de ids que precisam estar comprados antes.
 * effect.type: mesmo vocabulário de upgrades.js
 */
const PRESTIGE_TREE_DATA = [
  {
    id: 'p_regis_eterno',
    name: 'Régis Eterno',
    icon: '♾️',
    description: 'A raiz de tudo. O primeiro passo além da vida mortal.',
    cost: 1,
    requires: [],
    position: { x: 50, y: 0 },
    effect: { type: 'global_mult', value: 10 }
  },
  {
    id: 'p_producao_celestial',
    name: 'Produção Celestial',
    icon: '🌤️',
    description: 'A produção começa a ecoar entre vidas.',
    cost: 3,
    requires: ['p_regis_eterno'],
    position: { x: 50, y: 1 },
    effect: { type: 'global_mult', value: 20 }
  },
  {
    id: 'p_clique_celestial',
    name: 'Clique Celestial',
    icon: '✋',
    description: 'Cada clique carrega um pouco da energia celestial.',
    cost: 5,
    requires: ['p_producao_celestial'],
    position: { x: 20, y: 2 },
    effect: { type: 'click_mult', value: 50 }
  },
  {
    id: 'p_fabricas_celestiais',
    name: 'Fábricas Celestiais',
    icon: '🏗️',
    description: 'Suas fábricas continuam existindo, de certa forma, entre ascensões.',
    cost: 5,
    requires: ['p_producao_celestial'],
    position: { x: 80, y: 2 },
    effect: { type: 'global_mult', value: 30 }
  },
  {
    id: 'p_memoria_ascendente',
    name: 'Memória Ascendente',
    icon: '🧠',
    description: 'Parte do progresso permanece na memória entre ascensões.',
    cost: 8,
    requires: ['p_clique_celestial', 'p_fabricas_celestiais'],
    position: { x: 50, y: 3 },
    effect: { type: 'start_bonus', value: 1000 }
  },
  {
    id: 'p_eficiencia_offline_celestial',
    name: 'Vigília Celestial',
    icon: '🕯️',
    description: 'Sua produção offline se torna quase tão eficiente quanto online.',
    cost: 10,
    requires: ['p_memoria_ascendente'],
    position: { x: 30, y: 4 },
    effect: { type: 'offline_mult', value: 50 }
  },
  {
    id: 'p_sorte_celestial',
    name: 'Sorte Celestial',
    icon: '🍀',
    description: 'Eventos raros passam a aparecer com mais frequência.',
    cost: 10,
    requires: ['p_memoria_ascendente'],
    position: { x: 70, y: 4 },
    effect: { type: 'event_chance', value: 50 }
  },
  {
    id: 'p_combo_celestial',
    name: 'Combo Celestial',
    icon: '🎶',
    description: 'Seus combos de clique se tornam ainda mais poderosos.',
    cost: 12,
    requires: ['p_eficiencia_offline_celestial'],
    position: { x: 15, y: 5 },
    effect: { type: 'combo_mult', value: 75 }
  },
  {
    id: 'p_producao_celestial_ii',
    name: 'Produção Celestial II',
    icon: '🌤️',
    description: 'A energia celestial se intensifica ainda mais.',
    cost: 15,
    requires: ['p_eficiencia_offline_celestial', 'p_sorte_celestial'],
    position: { x: 50, y: 5 },
    effect: { type: 'global_mult', value: 40 }
  },
  {
    id: 'p_duracao_celestial',
    name: 'Duração Celestial',
    icon: '⏳',
    description: 'Eventos temporários duram significativamente mais.',
    cost: 15,
    requires: ['p_sorte_celestial'],
    position: { x: 85, y: 5 },
    effect: { type: 'golden_duration', value: 50 }
  },
  {
    id: 'p_clique_celestial_ii',
    name: 'Clique Celestial II',
    icon: '✋',
    description: 'O clique celestial atinge um novo patamar.',
    cost: 20,
    requires: ['p_combo_celestial'],
    position: { x: 15, y: 6 },
    effect: { type: 'click_mult', value: 100 }
  },
  {
    id: 'p_ordem_ascendente',
    name: 'Ordem Ascendente',
    icon: '⚖️',
    description: 'Uma ordem lógica se impõe sobre o caos da produção.',
    cost: 25,
    requires: ['p_producao_celestial_ii'],
    position: { x: 50, y: 6 },
    effect: { type: 'global_mult', value: 60 }
  },
  {
    id: 'p_regis_celestial_puro',
    name: 'Régis Celestial Puro',
    icon: '💎',
    description: 'A forma mais pura de Régis já concebida.',
    cost: 30,
    requires: ['p_duracao_celestial'],
    position: { x: 85, y: 6 },
    effect: { type: 'global_mult', value: 60 }
  },
  {
    id: 'p_ascensao_facilitada',
    name: 'Ascensão Facilitada',
    icon: '🪜',
    description: 'Cada ascensão futura exige um pouco menos de Régis totais.',
    cost: 40,
    requires: ['p_ordem_ascendente'],
    position: { x: 35, y: 7 },
    effect: { type: 'prestige_ease', value: 10 }
  },
  {
    id: 'p_multiverso_pessoal',
    name: 'Multiverso Pessoal',
    icon: '🌌',
    description: 'Você começa a acessar recursos de outras versões de si mesmo.',
    cost: 40,
    requires: ['p_regis_celestial_puro'],
    position: { x: 65, y: 7 },
    effect: { type: 'global_mult', value: 80 }
  },
  {
    id: 'p_concilio_dos_ascendentes',
    name: 'Concílio dos Ascendentes',
    icon: '👑',
    description: 'O topo da árvore original. Poucos chegam até aqui.',
    cost: 75,
    requires: ['p_ascensao_facilitada', 'p_multiverso_pessoal'],
    position: { x: 50, y: 8 },
    effect: { type: 'global_mult', value: 150 }
  },

  /* ------------------------------------------------------------
   * Expansão v2 da árvore celestial — continua além do Concílio.
   * ------------------------------------------------------------ */
  {
    id: 'p_arquivo_das_ascensoes',
    name: 'Arquivo das Ascensões',
    icon: '📚',
    description: 'Cada ascensão realizada passa a valer um pouco mais de bônus permanente.',
    cost: 100,
    requires: ['p_concilio_dos_ascendentes'],
    position: { x: 30, y: 9 },
    effect: { type: 'ascension_bonus_add', value: 1 } // +1 ponto percentual por ascensão (soma ao bônus base de 3%)
  },
  {
    id: 'p_clique_transcendental',
    name: 'Clique Transcendental',
    icon: '☄️',
    description: 'O clique deixa de ser apenas manual e passa a ecoar em escala celestial.',
    cost: 100,
    requires: ['p_concilio_dos_ascendentes'],
    position: { x: 70, y: 9 },
    effect: { type: 'click_mult', value: 150 }
  },
  {
    id: 'p_producao_transcendental',
    name: 'Produção Transcendental',
    icon: '🌠',
    description: 'A energia celestial passa a alimentar diretamente todos os produtores.',
    cost: 150,
    requires: ['p_arquivo_das_ascensoes', 'p_clique_transcendental'],
    position: { x: 50, y: 10 },
    effect: { type: 'global_mult', value: 200 }
  },
  {
    id: 'p_sinergia_universal',
    name: 'Sinergia Universal',
    icon: '🔗',
    description: 'Reforça todas as sinergias entre produtores adquiridas via upgrades normais.',
    cost: 200,
    requires: ['p_producao_transcendental'],
    position: { x: 30, y: 11 },
    effect: { type: 'global_mult', value: 120 }
  },
  {
    id: 'p_categoria_transcendental',
    name: 'Ordem das Categorias',
    icon: '🗂️',
    description: 'Todos os bônus de categoria de produtores ficam ainda mais fortes.',
    cost: 200,
    requires: ['p_producao_transcendental'],
    position: { x: 70, y: 11 },
    effect: { type: 'category_mult', category: 'transcendental', value: 100 }
  },
  {
    id: 'p_eco_permanente',
    name: 'Eco Permanente',
    icon: '🔊',
    description: 'O eco das ascensões passadas nunca mais se apaga.',
    cost: 300,
    requires: ['p_sinergia_universal', 'p_categoria_transcendental'],
    position: { x: 50, y: 12 },
    effect: { type: 'offline_mult', value: 50 }
  },
  {
    id: 'p_portal_permanente',
    name: 'Portal Permanente',
    icon: '🌀',
    description: 'Eventos especiais aparecem com muito mais frequência e duram muito mais.',
    cost: 350,
    requires: ['p_eco_permanente'],
    position: { x: 30, y: 13 },
    effect: { type: 'event_chance', value: 100 }
  },
  {
    id: 'p_regencia_celestial',
    name: 'Regência Celestial',
    icon: '🏛️',
    description: 'Você agora rege parte da própria estrutura do Régis.',
    cost: 350,
    requires: ['p_eco_permanente'],
    position: { x: 70, y: 13 },
    effect: { type: 'global_mult', value: 250 }
  },
  {
    id: 'p_transcendencia_final',
    name: 'Transcendência',
    icon: '🌟',
    description: 'O novo topo da árvore celestial. Além dela, só a Ressonância Infinita.',
    cost: 500,
    requires: ['p_portal_permanente', 'p_regencia_celestial'],
    position: { x: 50, y: 14 },
    effect: { type: 'global_mult', value: 300 }
  }
];

/**
 * Upgrade celestial repetível ("infinito"): desbloqueado ao concluir a
 * árvore inteira, pode ser comprado indefinidamente para que sempre exista
 * uma forma de progredir com Régis Celestiais mesmo depois de terminar toda
 * a árvore de nós únicos. Custo cresce geometricamente a cada nível.
 */
const PRESTIGE_INFINITE_UPGRADE = {
  id: 'p_infinito_ressonancia',
  name: 'Ressonância Celestial Infinita',
  icon: '♾️',
  description: 'Aumenta permanentemente toda a produção. Pode ser comprada repetidamente, sem limite.',
  requiresNodeId: 'p_transcendencia_final',
  baseCost: 100,
  costGrowth: 1.35,
  effectPerLevel: { type: 'global_mult', value: 5 } // +5% de produção global por nível
};
