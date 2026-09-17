/**
 * data/upgrades.js — upgrades do Régis Clicker.
 *
 * effect.type possíveis:
 *  - 'click_add'      : soma valor fixo ao clique base
 *  - 'click_mult'      : soma "value"% ao multiplicador de clique
 *  - 'building_mult'    : soma "value"% ao multiplicador do produtor "building"
 *  - 'global_mult'      : soma "value"% ao multiplicador global de produção (CPS)
 *  - 'all_mult'         : soma "value"% tanto na produção quanto no clique
 *  - 'combo_mult'       : soma "value"% ao bônus de combo de clique
 *  - 'offline_mult'      : soma "value"% à eficiência de produção offline
 *  - 'event_chance'      : soma "value"% à chance de eventos aleatórios aparecerem
 *  - 'golden_duration'    : soma "value"% à duração de eventos temporários
 *
 * unlock.type possíveis: 'always', 'totalRegis', 'buildingCount', 'clicks', 'ascensions'
 */

const HANDCRAFTED_UPGRADES = [
  // ---------- CLIQUE ----------
  {
    id: 'click_dedo_forte',
    name: 'Dedo Treinado',
    icon: '👆',
    category: 'clique',
    description: 'Anos de prática clicando resultam em... mais Régis por clique.',
    lore: 'Ele não sente mais o dedo. Mas sente o poder.',
    cost: '50',
    unlock: { type: 'always' },
    effect: { type: 'click_add', value: 1 }
  },
  {
    id: 'click_luva_regis',
    name: 'Luva de Régis',
    icon: '🧤',
    category: 'clique',
    description: 'Uma luva especial fabricada com fibras de Régis reciclado.',
    lore: 'Aumenta o clique em 100%.',
    cost: '500',
    unlock: { type: 'always' },
    effect: { type: 'click_mult', value: 100 }
  },
  {
    id: 'click_mouse_gamer',
    name: 'Mouse Ultra Sensível',
    icon: '🖱️',
    category: 'clique',
    description: 'RGB não aumenta o desempenho. Mas ajuda psicologicamente.',
    lore: 'Aumenta o clique em 100%.',
    cost: '5000',
    unlock: { type: 'buildingCount', building: 'cliqueiro', count: 5 },
    effect: { type: 'click_mult', value: 100 }
  },
  {
    id: 'click_academia_dedos',
    name: 'Academia de Dedos',
    icon: '💪',
    category: 'clique',
    description: 'Musculação especializada em falanges.',
    lore: 'Aumenta o clique em 150%.',
    cost: '75000',
    unlock: { type: 'clicks', amount: 500 },
    effect: { type: 'click_mult', value: 150 }
  },
  {
    id: 'click_prótese_regisiana',
    name: 'Prótese Régisiana',
    icon: '🦾',
    category: 'clique',
    description: 'Biônica, resistente e assustadoramente eficiente.',
    lore: 'Aumenta o clique em 200%.',
    cost: '2000000',
    unlock: { type: 'clicks', amount: 2500 },
    effect: { type: 'click_mult', value: 200 }
  },
  {
    id: 'click_energia_da_producao',
    name: 'Ressonância de Produção',
    icon: '🔗',
    category: 'clique',
    description: 'Cada produtor comprado ecoa um pouco de força no seu clique.',
    lore: 'O clique passa a considerar 1% da sua produção por segundo.',
    cost: '900000',
    unlock: { type: 'totalRegis', amount: '1e6' },
    effect: { type: 'click_from_cps', value: 1 }
  },
  {
    id: 'click_ressonancia_2',
    name: 'Ressonância de Produção II',
    icon: '🔗',
    category: 'clique',
    description: 'A ligação entre clique e produção se intensifica.',
    lore: 'O clique passa a considerar mais 2% da sua produção por segundo.',
    cost: '5e8',
    unlock: { type: 'totalRegis', amount: '1e9' },
    effect: { type: 'click_from_cps', value: 2 }
  },

  // ---------- COMBO ----------
  {
    id: 'combo_ritmo',
    name: 'Senso de Ritmo',
    icon: '🎵',
    category: 'combo',
    description: 'Clicar no compasso certo rende bônus maiores.',
    lore: 'Aumenta o bônus de combo em 25%.',
    cost: '20000',
    unlock: { type: 'clicks', amount: 100 },
    effect: { type: 'combo_mult', value: 25 }
  },
  {
    id: 'combo_metronomo',
    name: 'Metrônomo de Régis',
    icon: '⏱️',
    category: 'combo',
    description: 'Mantém o ritmo dos seus cliques perfeitamente calibrado.',
    lore: 'Aumenta o bônus de combo em 50%.',
    cost: '4000000',
    unlock: { type: 'clicks', amount: 5000 },
    effect: { type: 'combo_mult', value: 50 }
  },

  // ---------- GLOBAL / PRODUÇÃO ----------
  {
    id: 'global_manual_operacao',
    name: 'Manual de Operações',
    icon: '📘',
    category: 'producao',
    description: 'Todos os produtores agora sabem exatamente o que fazer.',
    lore: 'Aumenta toda a produção em 10%.',
    cost: '1000',
    unlock: { type: 'buildingCount', building: 'cliqueiro', count: 1 },
    effect: { type: 'global_mult', value: 10 }
  },
  {
    id: 'global_sindicato',
    name: 'Sindicato do Régis',
    icon: '🤝',
    category: 'producao',
    description: 'Trabalhadores organizados produzem mais (e reclamam menos).',
    lore: 'Aumenta toda a produção em 25%.',
    cost: '150000',
    unlock: { type: 'totalRegis', amount: '1e5' },
    effect: { type: 'global_mult', value: 25 }
  },
  {
    id: 'global_certificacao',
    name: 'Certificação ISO-Régis',
    icon: '📜',
    category: 'producao',
    description: 'Uma auditoria absurdamente detalhada aumentou a eficiência geral.',
    lore: 'Aumenta toda a produção em 25%.',
    cost: '3000000',
    unlock: { type: 'totalRegis', amount: '2e6' },
    effect: { type: 'global_mult', value: 25 }
  },
  {
    id: 'global_ia_regisiana',
    name: 'IA Régisiana',
    icon: '🤖',
    category: 'producao',
    description: 'Uma inteligência artificial otimiza cada etapa da produção.',
    lore: 'Aumenta toda a produção em 50%.',
    cost: '8e8',
    unlock: { type: 'totalRegis', amount: '5e8' },
    effect: { type: 'global_mult', value: 50 }
  },
  {
    id: 'global_algoritmo_secreto',
    name: 'Algoritmo Secreto',
    icon: '🧮',
    category: 'producao',
    description: 'Ninguém entende como funciona. Mas funciona.',
    lore: 'Aumenta toda a produção em 75%.',
    cost: '6e11',
    unlock: { type: 'totalRegis', amount: '4e11' },
    effect: { type: 'global_mult', value: 75 }
  },
  {
    id: 'global_ordem_regisiana',
    name: 'Ordem Régisiana',
    icon: '⛩️',
    category: 'producao',
    description: 'Uma organização secreta zela pela eficiência de todos os produtores.',
    lore: 'Aumenta toda a produção em 100%.',
    cost: '9e14',
    unlock: { type: 'totalRegis', amount: '7e14' },
    effect: { type: 'global_mult', value: 100 }
  },
  {
    id: 'global_singularidade_produtiva',
    name: 'Singularidade Produtiva',
    icon: '♾️',
    category: 'producao',
    description: 'O ponto em que produção deixa de fazer sentido matematicamente.',
    lore: 'Aumenta toda a produção em 150%.',
    cost: '5e18',
    unlock: { type: 'totalRegis', amount: '3e18' },
    effect: { type: 'global_mult', value: 150 }
  },

  // ---------- OFFLINE ----------
  {
    id: 'offline_diario_de_bordo',
    name: 'Diário de Bordo',
    icon: '📓',
    category: 'offline',
    description: 'Registra o que aconteceu enquanto você estava fora — e melhora isso.',
    lore: 'Aumenta a eficiência da produção offline em 25%.',
    cost: '25000',
    unlock: { type: 'totalRegis', amount: '1e4' },
    effect: { type: 'offline_mult', value: 25 }
  },
  {
    id: 'offline_turno_da_noite',
    name: 'Turno da Noite',
    icon: '🌙',
    category: 'offline',
    description: 'Uma equipe assume a produção enquanto você dorme.',
    lore: 'Aumenta a eficiência da produção offline em 25%.',
    cost: '4000000',
    unlock: { type: 'totalRegis', amount: '2e6' },
    effect: { type: 'offline_mult', value: 25 }
  },
  {
    id: 'offline_piloto_automatico',
    name: 'Piloto Automático Régisiano',
    icon: '🛫',
    category: 'offline',
    description: 'O sistema se administra sozinho, quase sem supervisão.',
    lore: 'Aumenta a eficiência da produção offline em 50%.',
    cost: '2e9',
    unlock: { type: 'totalRegis', amount: '1e9' },
    effect: { type: 'offline_mult', value: 50 }
  },

  // ---------- EVENTOS ----------
  {
    id: 'evento_sorte_iniciante',
    name: 'Sorte de Iniciante',
    icon: '🍀',
    category: 'eventos',
    description: 'Aumenta a chance de eventos especiais aparecerem.',
    lore: 'Aumenta a chance de eventos em 20%.',
    cost: '60000',
    unlock: { type: 'totalRegis', amount: '3e4' },
    effect: { type: 'event_chance', value: 20 }
  },
  {
    id: 'evento_ima_de_regis',
    name: 'Ímã de Régis Dourado',
    icon: '🧲',
    category: 'eventos',
    description: 'Atrai eventos especiais como um ímã atrai... coisas magnéticas.',
    lore: 'Aumenta a chance de eventos em 30%.',
    cost: '9000000',
    unlock: { type: 'totalRegis', amount: '5e6' },
    effect: { type: 'event_chance', value: 30 }
  },
  {
    id: 'evento_radar_dourado',
    name: 'Radar de Régis Dourado',
    icon: '📡',
    category: 'eventos',
    description: 'Detecta a aproximação de eventos raros com antecedência.',
    lore: 'Aumenta a duração de eventos temporários em 30%.',
    cost: '5e9',
    unlock: { type: 'totalRegis', amount: '3e9' },
    effect: { type: 'golden_duration', value: 30 }
  },
  {
    id: 'evento_convite_cosmico',
    name: 'Convite Cósmico',
    icon: '✉️',
    category: 'eventos',
    description: 'Um convite formal para que eventos raros apareçam com mais frequência.',
    lore: 'Aumenta a chance de eventos em 40%.',
    cost: '4e13',
    unlock: { type: 'totalRegis', amount: '2e13' },
    effect: { type: 'event_chance', value: 40 }
  },

  // ---------- ESPECIAIS / SECRETOS ----------
  {
    id: 'secreto_regis_de_ouro',
    name: 'O Régis de Ouro',
    icon: '🏆',
    category: 'secreto',
    description: 'Uma lenda entre os produtores. Poucos acreditam que exista de verdade.',
    lore: 'Upgrade secreto. Aumenta toda a produção em 33%.',
    cost: '3.33e7',
    unlock: { type: 'clicks', amount: 3333 },
    effect: { type: 'global_mult', value: 33 },
    secret: true
  },
  {
    id: 'secreto_numero_da_besta',
    name: 'Régis 666',
    icon: '😈',
    category: 'secreto',
    description: 'Ninguém sabe o que acontece quando você compra exatamente 666 upgrades. Agora você sabe.',
    lore: 'Upgrade secreto de clique.',
    cost: '6.66e8',
    unlock: { type: 'totalRegis', amount: '6.66e8' },
    effect: { type: 'click_mult', value: 66 },
    secret: true
  },
  {
    id: 'secreto_regis_invertido',
    name: 'Régis de Cabeça Para Baixo',
    icon: '🙃',
    category: 'secreto',
    description: 'Ninguém sabe por que virar o Régis de cabeça para baixo aumenta a produção. Mas funciona.',
    lore: 'Upgrade secreto. Aumenta toda a produção em 21%.',
    cost: '2.1e16',
    unlock: { type: 'ascensions', amount: 1 },
    effect: { type: 'global_mult', value: 21 },
    secret: true
  },

  // ---------- MULTIPLICADORES DE PRESTÍGIO (compráveis com Régis normal, mas exigem ascensão) ----------
  {
    id: 'prestigio_memoria_residual',
    name: 'Memória Residual',
    icon: '🧠',
    category: 'prestigio',
    description: 'Um pouco do conhecimento da vida anterior permanece.',
    lore: 'Aumenta toda a produção em 40%. Requer ao menos 1 ascensão.',
    cost: '1e10',
    unlock: { type: 'ascensions', amount: 1 },
    effect: { type: 'global_mult', value: 40 }
  },
  {
    id: 'prestigio_ecos_celestiais',
    name: 'Ecos Celestiais',
    icon: '✨',
    category: 'prestigio',
    description: 'Sussurros da vida anterior aumentam sua eficiência.',
    lore: 'Aumenta o clique em 100%. Requer ao menos 2 ascensões.',
    cost: '1e12',
    unlock: { type: 'ascensions', amount: 2 },
    effect: { type: 'click_mult', value: 100 }
  }
];

/**
 * Gera automaticamente 2 upgrades de produção para cada produtor
 * (marco de quantidade 10 e 25), mantendo consistência e evitando
 * centenas de linhas repetidas manualmente.
 */
function generateBuildingUpgrades() {
  const generated = [];
  const milestones = [
    { count: 10, bonus: 100, costMult: 12 },
    { count: 25, bonus: 100, costMult: 40 },
    { count: 50, bonus: 100, costMult: 120 },
    { count: 100, bonus: 150, costMult: 400 }
  ];

  BUILDINGS_DATA.forEach((building, idx) => {
    milestones.forEach((ms, msIdx) => {
      const baseCostNum = building.baseCost * ms.costMult;
      generated.push({
        id: `${building.id}_marco_${ms.count}`,
        name: `${building.name} Aprimorado ${msIdx > 0 ? 'x' + (msIdx + 1) : ''}`.trim(),
        icon: building.icon,
        category: 'producao_produtor',
        description: `Melhora significativa aplicada a todos os ${building.name}.`,
        lore: `Dobra a produção de ${building.name} ao atingir ${ms.count} unidades.`,
        cost: String(baseCostNum),
        unlock: { type: 'buildingCount', building: building.id, count: ms.count },
        effect: { type: 'building_mult', building: building.id, value: ms.bonus }
      });
    });
  });

  return generated;
}

const UPGRADES_DATA = [...HANDCRAFTED_UPGRADES, ...generateBuildingUpgrades()];
