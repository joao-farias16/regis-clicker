/**
 * data/prestige.js — Régis Celestiais e a árvore de prestígio.
 *
 * Fórmula de prestígio: celestiais = floor( (totalRegisVidaToda / 1e12) ^ (1/2.2) )
 * Configurável através de PRESTIGE_CONFIG.
 */

const PRESTIGE_CONFIG = {
  divisor: 1e12,
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
    description: 'O topo da árvore. Poucos chegam até aqui.',
    cost: 75,
    requires: ['p_ascensao_facilitada', 'p_multiverso_pessoal'],
    position: { x: 50, y: 8 },
    effect: { type: 'global_mult', value: 150 }
  }
];
