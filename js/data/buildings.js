/**
 * data/buildings.js — os 20 produtores de Régis.
 * custo = baseCost * costFactor ^ quantidade
 * produção total do produtor = baseProduction * quantidade * multiplicadores
 */

const BUILDINGS_DATA = [
  {
    id: 'cliqueiro',
    category: 'raiz',
    name: 'Cliqueiro',
    icon: '👆',
    lore: 'Um indivíduo aparentemente comum. Ninguém sabe quem contratou ele. Ele continua clicando.',
    baseCost: 15,
    costFactor: 1.14,
    baseProduction: 0.1,
    unlockAt: 0
  },
  {
    id: 'estagiario',
    category: 'raiz',
    name: 'Estagiário do Régis',
    icon: '🧑‍💼',
    lore: 'Não recebe, mas aprende muito sobre a arte de gerar Régis.',
    baseCost: 100,
    costFactor: 1.15,
    baseProduction: 0.8,
    unlockAt: 0
  },
  {
    id: 'oficina',
    category: 'raiz',
    name: 'Oficina do Régis',
    icon: '🔧',
    lore: 'Cheira a óleo e a decisões questionáveis.',
    baseCost: 1100,
    costFactor: 1.15,
    baseProduction: 6,
    unlockAt: 0
  },
  {
    id: 'fabrica',
    category: 'raiz',
    name: 'Fábrica de Régis',
    icon: '🏭',
    lore: 'Produz Régis 24 horas por dia. Os Régis não perguntam por que.',
    baseCost: 12000,
    costFactor: 1.15,
    baseProduction: 47,
    unlockAt: 0
  },
  {
    id: 'laboratorio',
    category: 'raiz',
    name: 'Laboratório de Régis',
    icon: '🧪',
    lore: 'Cientistas tentam entender de onde vêm os Régis. Ainda não descobriram.',
    baseCost: 130000,
    costFactor: 1.15,
    baseProduction: 260,
    unlockAt: 0
  },
  {
    id: 'torre',
    category: 'industrial',
    name: 'Torre de Transmissão de Régis',
    icon: '📡',
    lore: 'Transmite Régis em frequências que só cachorros conseguem ouvir.',
    baseCost: 1400000,
    costFactor: 1.15,
    baseProduction: 1400,
    unlockAt: 0
  },
  {
    id: 'fazenda',
    category: 'industrial',
    name: 'Fazenda de Régis',
    icon: '🌾',
    lore: 'Os Régis crescem em fileiras perfeitas, sob o sol.',
    baseCost: 20000000,
    costFactor: 1.15,
    baseProduction: 7800,
    unlockAt: 0
  },
  {
    id: 'mina',
    category: 'industrial',
    name: 'Mina de Régis',
    icon: '⛏️',
    lore: 'Escavada bem fundo, onde os Régis são encontrados em veios brilhantes.',
    baseCost: 330000000,
    costFactor: 1.15,
    baseProduction: 44000,
    unlockAt: 0
  },
  {
    id: 'portal',
    category: 'industrial',
    name: 'Portal Dimensional de Régis',
    icon: '🌀',
    lore: 'Ninguém sabe para onde ele leva. Só que de lá saem muitos Régis.',
    baseCost: 5100000000,
    costFactor: 1.15,
    baseProduction: 260000,
    unlockAt: 0
  },
  {
    id: 'satelite',
    category: 'industrial',
    name: 'Satélite de Régis',
    icon: '🛰️',
    lore: 'Orbita o planeta capturando Régis cósmicos.',
    baseCost: 75000000000,
    costFactor: 1.15,
    baseProduction: 1600000,
    unlockAt: 0
  },
  {
    id: 'usina',
    category: 'tecnologico',
    name: 'Usina de Régis',
    icon: '⚡',
    lore: 'Converte energia pura em Régis. A conta de luz é assustadora.',
    baseCost: 1000000000000,
    costFactor: 1.15,
    baseProduction: 10000000,
    unlockAt: 0
  },
  {
    id: 'universidade',
    category: 'tecnologico',
    name: 'Universidade do Régis',
    icon: '🎓',
    lore: 'Forma mestres e doutores em Régisologia Aplicada.',
    baseCost: 14000000000000,
    costFactor: 1.15,
    baseProduction: 65000000,
    unlockAt: 0
  },
  {
    id: 'reator',
    category: 'tecnologico',
    name: 'Reator Quântico de Régis',
    icon: '☢️',
    lore: 'Divide o átomo do Régis. Isso provavelmente não é seguro.',
    baseCost: 170000000000000,
    costFactor: 1.15,
    baseProduction: 430000000,
    unlockAt: 0
  },
  {
    id: 'colonia',
    category: 'tecnologico',
    name: 'Colônia Lunar de Régis',
    icon: '🌕',
    lore: 'Régis produzidos em gravidade reduzida rendem mais. Ninguém sabe explicar por quê.',
    baseCost: 2100000000000000,
    costFactor: 1.15,
    baseProduction: 2900000000,
    unlockAt: 0
  },
  {
    id: 'estacao',
    category: 'tecnologico',
    name: 'Estação Espacial Régis-1',
    icon: '🛸',
    lore: 'Órbita geoestacionária dedicada inteiramente à causa do Régis.',
    baseCost: 26000000000000000,
    costFactor: 1.15,
    baseProduction: 21000000000,
    unlockAt: 0
  },
  {
    id: 'singularidade',
    category: 'cosmico',
    name: 'Singularidade de Régis',
    icon: '🕳️',
    lore: 'Um buraco negro que, por algum motivo, só engole e cospe Régis.',
    baseCost: 330000000000000000,
    costFactor: 1.15,
    baseProduction: 150000000000,
    unlockAt: 0
  },
  {
    id: 'multiverso',
    category: 'cosmico',
    name: 'Fenda Multiversal de Régis',
    icon: '🌌',
    lore: 'Em infinitos universos, existem infinitos Régis. Alguns chegam até aqui.',
    baseCost: 4200000000000000000,
    costFactor: 1.15,
    baseProduction: 1100000000000,
    unlockAt: 0
  },
  {
    id: 'templo',
    category: 'cosmico',
    name: 'Templo do Régis Eterno',
    icon: '🛕',
    lore: 'Monges dedicam suas vidas a venerar e multiplicar o Régis.',
    baseCost: 55000000000000000000,
    costFactor: 1.15,
    baseProduction: 8000000000000,
    unlockAt: 0
  },
  {
    id: 'entidade',
    category: 'cosmico',
    name: 'Entidade Régisiana',
    icon: '👁️',
    lore: 'Já não sabemos se ela produz Régis, ou se ela É Régis.',
    baseCost: 700000000000000000000,
    costFactor: 1.15,
    baseProduction: 58000000000000,
    unlockAt: 0
  },
  {
    id: 'concilio',
    category: 'cosmico',
    name: 'Concílio Supremo de Régis',
    icon: '👑',
    lore: 'A instância máxima da civilização Régisiana. O fim (?) da linha de produção.',
    baseCost: 9000000000000000000000,
    costFactor: 1.15,
    baseProduction: 420000000000000,
    unlockAt: 0
  },

  /* ---------------------------------------------------------------
   * Produtores "transcendentais" — expansão pós-Concílio.
   * Continuam a mesma progressão geométrica (custo x~13.5, produção x~7.3
   * a cada novo produtor), preservando a curva de balanceamento original.
   * --------------------------------------------------------------- */
  {
    id: 'nexo',
    category: 'transcendental',
    name: 'Nexo Régisiano',
    icon: '🔮',
    lore: 'Um ponto onde todas as linhas de produção de Régis se cruzam ao mesmo tempo.',
    baseCost: 1.215e23,
    costFactor: 1.15,
    baseProduction: 3.066e15,
    unlockAt: 0
  },
  {
    id: 'arquiteto_cosmico',
    category: 'transcendental',
    name: 'Arquiteto Cósmico do Régis',
    icon: '🧑‍🎨',
    lore: 'Projeta galáxias inteiras só para caber mais Régis dentro delas.',
    baseCost: 1.6403e24,
    costFactor: 1.15,
    baseProduction: 2.2382e16,
    unlockAt: 0
  },
  {
    id: 'forja_estelar',
    category: 'transcendental',
    name: 'Forja Estelar de Régis',
    icon: '⭐',
    lore: 'Usa o calor de estrelas inteiras para forjar Régis em escala cósmica.',
    baseCost: 2.2143e25,
    costFactor: 1.15,
    baseProduction: 1.6339e17,
    unlockAt: 0
  },
  {
    id: 'tribunal_regisiano',
    category: 'transcendental',
    name: 'Tribunal Régisiano',
    icon: '⚖️',
    lore: 'Julga se um determinado Régis é digno de existir. Quase todos são.',
    baseCost: 2.9894e26,
    costFactor: 1.15,
    baseProduction: 1.1927e18,
    unlockAt: 0
  },
  {
    id: 'coroa_infinita',
    category: 'transcendental',
    name: 'Coroa Infinita de Régis',
    icon: '🔱',
    lore: 'Não pertence a ninguém. Ou pertence a todos. Ninguém teve coragem de perguntar.',
    baseCost: 4.0356e27,
    costFactor: 1.15,
    baseProduction: 8.7069e18,
    unlockAt: 0
  },
  {
    id: 'arca_regisiana',
    category: 'transcendental',
    name: 'Arca Régisiana',
    icon: '🚢',
    lore: 'Guarda um exemplar de cada Régis que já existiu — e alguns que ainda vão existir.',
    baseCost: 5.4481e28,
    costFactor: 1.15,
    baseProduction: 6.356e19,
    unlockAt: 0
  },
  {
    id: 'dominio_regisiano',
    category: 'transcendental',
    name: 'Domínio Régisiano',
    icon: '🏰',
    lore: 'Um território que existe simultaneamente em todos os lugares onde alguém pensou em Régis.',
    baseCost: 7.3549e29,
    costFactor: 1.15,
    baseProduction: 4.6399e20,
    unlockAt: 0
  },
  {
    id: 'eco_do_criador',
    category: 'transcendental',
    name: 'Eco do Criador',
    icon: '🌈',
    lore: 'Dizem que é o eco de quem clicou pela primeira vez. Ninguém confirma. Ninguém nega.',
    baseCost: 9.9292e30,
    costFactor: 1.15,
    baseProduction: 3.3871e21,
    unlockAt: 0
  }
];

/** Nomes amigáveis das categorias de produtores, usados na UI e nos upgrades de categoria. */
const BUILDING_CATEGORY_LABELS = {
  raiz: 'Produtores Iniciais',
  industrial: 'Produtores Industriais',
  tecnologico: 'Produtores Tecnológicos',
  cosmico: 'Produtores Cósmicos',
  transcendental: 'Produtores Transcendentais'
};
