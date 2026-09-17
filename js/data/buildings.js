/**
 * data/buildings.js — os 20 produtores de Régis.
 * custo = baseCost * costFactor ^ quantidade
 * produção total do produtor = baseProduction * quantidade * multiplicadores
 */

const BUILDINGS_DATA = [
  {
    id: 'cliqueiro',
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
    name: 'Concílio Supremo de Régis',
    icon: '👑',
    lore: 'A instância máxima da civilização Régisiana. O fim (?) da linha de produção.',
    baseCost: 9000000000000000000000,
    costFactor: 1.15,
    baseProduction: 420000000000000,
    unlockAt: 0
  }
];
