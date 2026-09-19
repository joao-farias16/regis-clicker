// test/smoke.js — roda a lógica principal do jogo fora do navegador (via vm)
// para pegar erros de runtime antes da entrega. Não faz parte do jogo final.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const localStorageStub = (() => {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
})();

const documentStub = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: () => ({ classList: { add(){}, remove(){}, toggle(){} }, style: {}, addEventListener(){}, appendChild(){}, remove(){} }),
  body: { classList: { toggle(){}, add(){}, remove(){} }, addEventListener: () => {} }
};

const sandbox = {
  console,
  Math, Date, JSON, Object, Array, String, Number, Boolean, isFinite, isNaN,
  parseFloat, parseInt, setTimeout, clearTimeout, encodeURIComponent, decodeURIComponent,
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  window: {},
  localStorage: localStorageStub,
  document: documentStub,
  performance: { now: () => Date.now() },
  requestAnimationFrame: () => {},
  Notifications: { push: (msg) => console.log('  [toast]', msg), init(){} },
  UI: {
    refreshAll(){}, renderEventEntity(){}, clearEventEntity(){}, renderTopBar(){}, renderBuildings(){},
    spawnClickPopup(){}, els: { clickPopups: { getBoundingClientRect: () => ({left:0, top:0}) } }
  },
  AudioFX: { play(){} }
};
sandbox.window.localStorage = localStorageStub;
sandbox.global = sandbox;

let passCount = 0;
sandbox.__assert = function (cond, msg) {
  if (!cond) throw new Error('FALHA: ' + msg);
  passCount++;
  console.log('OK:', msg);
};

vm.createContext(sandbox);

const FILES = [
  'js/utils.js',
  'js/numbers.js',
  'js/data/buildings.js',
  'js/data/upgrades.js',
  'js/data/events.js',
  'js/data/prestige.js',
  'js/data/content.js',
  'js/data/achievements.js',
  'js/state.js',
  'js/economy.js',
  'js/buildings.js',
  'js/upgrades.js',
  'js/achievements.js',
  'js/events.js',
  'js/prestige.js',
  'js/offline.js',
  'js/save.js',
  'js/settings.js'
];

for (const f of FILES) {
  const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
  vm.runInContext(code, sandbox, { filename: f });
}

const testScript = `
gameState = createDefaultState();
BUILDINGS_DATA.forEach(b => gameState.buildings[b.id] = { owned: 0 });

// 1) estado inicial
__assert(StateGetters.regis().isZero(), 'estado inicial começa com 0 Régis');

// 2) clique básico
var clickVal = Economy.getClickValue();
StateGetters.addRegis(clickVal);
gameState.clicks = 1;
gameState.stats.totalClicks = 1;
__assert(StateGetters.regis().gt(Decimal.ZERO), 'clique gera Régis > 0');
__assert(formatNumber(StateGetters.regis()) === '1', 'primeiro clique vale exatamente 1 Régis');

// 3) compra de produtor
StateGetters.addRegis(Decimal.fromNumber(100000));
var buyResult = BuildingsLogic.buy('cliqueiro', 5);
__assert(buyResult.success, 'compra de 5 Cliqueiros bem-sucedida');
__assert(StateGetters.buildingOwned('cliqueiro') === 5, 'quantidade de Cliqueiros = 5 após compra');

// 4) CPS agora deve ser > 0
var cps = Economy.getTotalCps();
__assert(cps.gt(Decimal.ZERO), 'CPS > 0 após comprar produtores');

// 5) compra "máximo" nunca deve estourar o saldo
StateGetters.addRegis(Decimal.fromNumber(1e9));
var maxBuy = BuildingsLogic.buy('cliqueiro', 'max');
__assert(maxBuy.success, 'compra MÁXIMO bem-sucedida');
__assert(StateGetters.regis().gte(Decimal.ZERO), 'saldo nunca fica negativo após MÁXIMO');
__assert(!StateGetters.regis().isNegative(), 'sem valores negativos após MÁXIMO');

// 6) grandes números não geram NaN/Infinity
var huge = Decimal.fromNumber(1);
for (var i = 0; i < 500; i++) huge = huge.mul(Decimal.fromNumber(10));
StateGetters.addRegis(huge);
var hugeVal = StateGetters.regis();
__assert(isFinite(hugeVal.mantissa) && !Number.isNaN(hugeVal.mantissa), 'mantissa de número gigante continua finita');
__assert(formatNumber(hugeVal).indexOf('NaN') === -1, 'formatação de número gigante não contém NaN');
__assert(formatNumber(hugeVal).indexOf('Infinity') === -1, 'formatação de número gigante não contém Infinity');

// 7) upgrades: comprar um upgrade sempre disponível
StateGetters.addRegis(Decimal.fromNumber(1e7));
var upgradeBuy = UpgradesLogic.buy('click_dedo_forte');
__assert(upgradeBuy.success, 'compra do upgrade "Dedo Treinado" bem-sucedida');
var doubleBuy = UpgradesLogic.buy('click_dedo_forte');
__assert(!doubleBuy.success, 'upgrade já comprado não pode ser comprado de novo');

// 8) achievements: primeiro clique já deve estar desbloqueado
AchievementsLogic.checkAll();
__assert(gameState.achievementsUnlocked['inicio_de_tudo'] === true, 'conquista de primeiro clique desbloqueada');

// 9) ascensão
gameState.totalRegisEarned = Decimal.fromNumber(5e13).toJSON();
var gain = PrestigeLogic.calculateCelestialGain();
__assert(gain.gt(Decimal.ZERO), 'cálculo de ganho de prestígio > 0 com Régis suficiente');
var ascendResult = PrestigeLogic.ascend();
__assert(ascendResult.success, 'ascensão bem-sucedida');
__assert(gameState.prestige.ascensions === 1, 'contador de ascensões incrementado');
__assert(StateGetters.regis().isZero(), 'Régis reseta após ascensão');
__assert(StateGetters.buildingOwned('cliqueiro') === 0, 'produtores resetam após ascensão');
__assert(StateGetters.celestial().gt(Decimal.ZERO), 'Régis Celestiais > 0 após ascensão');

// 10) upgrades normais são perdidos na ascensão, mas permanentes de prestígio não
__assert(!gameState.upgradesBought['click_dedo_forte'], 'upgrade normal perdido após ascensão');

// 11) save / load
Save.save();
__assert(localStorage.getItem('regisClickerSave') !== null, 'save gravado no localStorage');
StateGetters.addRegis(Decimal.fromNumber(999));
Save.load();
__assert(StateGetters.regis().isZero(), 'load restaura o estado salvo anteriormente (0 Régis, não 999)');

// 12) export / import
var exported = Save.exportSave();
__assert(typeof exported === 'string' && exported.length > 10, 'exportSave gera uma string não vazia');
StateGetters.addRegis(Decimal.fromNumber(42));
var importResult = Save.importSave(exported);
__assert(importResult.success, 'importSave aceita um código válido');
__assert(StateGetters.regis().isZero(), 'estado importado bate com o exportado');

var badImport = Save.importSave('isso-nao-e-um-save-valido!!');
__assert(!badImport.success, 'importSave rejeita código inválido sem travar');

// 13) save corrompido cai para o backup
localStorage.setItem('regisClickerSave', '{ json quebrado');
var loadedFromBackup = Save.load();
__assert(loadedFromBackup === true, 'save corrompido recupera do backup com sucesso');

// 14) reset completo
Save.hardReset();
__assert(StateGetters.regis().isZero(), 'hardReset zera os Régis');
__assert(StateGetters.celestial().isZero(), 'hardReset zera os Régis Celestiais');

// 15) offline progress
gameState.buildings['cliqueiro'].owned = 50;
gameState.stats.lastSeenAt = Date.now() - 3600 * 1000; // 1 hora atrás
var offlineResult = OfflineLogic.process();
__assert(offlineResult !== null, 'progresso offline é calculado para ausência de 1 hora');
__assert(offlineResult.earned.gte(Decimal.ZERO), 'ganho offline nunca é negativo');

// 16) divisão por zero não quebra o sistema Decimal
var divZero = Decimal.fromNumber(100).div(Decimal.ZERO);
__assert(divZero.isZero(), 'divisão por zero retorna 0 em vez de travar');

// 17) upgrade "comprar máximo" de produtor mais caro não deve travar com saldo 0
StateGetters.setRegis(Decimal.ZERO);
var zeroBuy = BuildingsLogic.buy('concilio', 'max');
__assert(!zeroBuy.success, 'compra sem saldo é corretamente rejeitada');

/* ===================== TESTES DA ATUALIZAÇÃO v2 ===================== */

// 18) 28 produtores no total (20 originais + 8 transcendentais), todos com categoria
__assert(BUILDINGS_DATA.length === 28, 'existem 28 produtores no total após a expansão v2');
__assert(BUILDINGS_DATA.every(b => !!b.category), 'todos os produtores possuem uma categoria definida');
__assert(BUILDINGS_DATA.find(b => b.id === 'eco_do_criador') !== undefined, 'produtor transcendental "Eco do Criador" existe');
__assert(BUILDINGS_DATA.find(b => b.id === 'cliqueiro').baseCost === 15, 'produtor original "Cliqueiro" manteve seu custo base');

// 19) categoria e sinergia afetam a produção corretamente
gameState = createDefaultState();
BUILDINGS_DATA.forEach(b => gameState.buildings[b.id] = { owned: 0 });
StateGetters.addRegis(Decimal.fromNumber(1e10));
BuildingsLogic.buy('cliqueiro', 10);
BuildingsLogic.buy('fabrica', 5);
var fabricaProdSemSinergia = Economy.getBuildingProductionPerSecond('fabrica');
gameState.upgradesBought['sinergia_cliqueiro_fabrica'] = true;
var fabricaProdComSinergia = Economy.getBuildingProductionPerSecond('fabrica');
__assert(fabricaProdComSinergia.gt(fabricaProdSemSinergia), 'upgrade de sinergia aumenta a produção do produtor-alvo');
delete gameState.upgradesBought['sinergia_cliqueiro_fabrica'];

var raizProdSemCategoria = Economy.getBuildingProductionPerSecond('cliqueiro');
gameState.upgradesBought['categoria_raiz'] = true;
var raizProdComCategoria = Economy.getBuildingProductionPerSecond('cliqueiro');
__assert(raizProdComCategoria.gt(raizProdSemCategoria), 'upgrade de categoria aumenta a produção de todos os produtores da categoria');

// 20) rebalanceamento de prestígio: o requisito cresce a cada ascensão
gameState = createDefaultState();
BUILDINGS_DATA.forEach(b => gameState.buildings[b.id] = { owned: 0 });
var divisorAscensao0 = PrestigeLogic.getEffectiveDivisor(0);
var divisorAscensao1 = PrestigeLogic.getEffectiveDivisor(1);
var divisorAscensao5 = PrestigeLogic.getEffectiveDivisor(5);
__assert(divisorAscensao1 > divisorAscensao0, 'o divisor de prestígio cresce após a 1ª ascensão');
__assert(divisorAscensao5 > divisorAscensao1, 'o divisor de prestígio continua crescendo em ascensões seguintes');

// 21) o exploit original está corrigido: totalRegisEarned (vitalício) não é
// mais suficiente sozinho — o ganho depende do Régis produzido NESTA era.
gameState.totalRegisEarned = Decimal.fromNumber(5e13).toJSON(); // vitalício alto
gameState.totalRegisThisAscension = Decimal.ZERO.toJSON();       // mas nada produzido desde o reset
var gainSemProgresso = PrestigeLogic.calculateCelestialGain();
__assert(gainSemProgresso.isZero(), 'sem produção nesta era, o ganho de prestígio é zero mesmo com total vitalício alto (exploit corrigido)');

gameState.totalRegisThisAscension = Decimal.fromNumber(5e13).toJSON();
var gainComProgresso = PrestigeLogic.calculateCelestialGain();
__assert(gainComProgresso.gt(Decimal.ZERO), 'com produção real nesta era, o ganho de prestígio volta a ser positivo');

// 22) duas ascensões seguidas: a segunda exige mais Régis-desta-era que a primeira para o mesmo ganho
gameState.prestige.ascensions = 0;
var precisaEra0 = PrestigeLogic.getEffectiveDivisor();
gameState.prestige.ascensions = 1;
var precisaEra1 = PrestigeLogic.getEffectiveDivisor();
__assert(precisaEra1 > precisaEra0, 'a 2ª ascensão exige mais Régis-desta-era que a 1ª para o mesmo ganho — corrige o exploit de ascender repetidamente');

// 23) upgrade celestial repetível (Ressonância Infinita)
gameState = createDefaultState();
BUILDINGS_DATA.forEach(b => gameState.buildings[b.id] = { owned: 0 });
__assert(!PrestigeLogic.isInfiniteUnlocked(), 'Ressonância Infinita começa bloqueada');
gameState.prestige.permanentUpgrades['p_transcendencia_final'] = true;
__assert(PrestigeLogic.isInfiniteUnlocked(), 'Ressonância Infinita desbloqueia após completar a árvore até "Transcendência"');
gameState.prestige.celestial = Decimal.fromNumber(1000).toJSON();
var infiniteBuy1 = PrestigeLogic.buyInfiniteLevel();
__assert(infiniteBuy1.success, 'primeira compra da Ressonância Infinita bem-sucedida');
var custoNivel2 = PrestigeLogic.getInfiniteCost();
var infiniteBuy2 = PrestigeLogic.buyInfiniteLevel();
__assert(infiniteBuy2.success, 'segunda compra da Ressonância Infinita bem-sucedida');
__assert(gameState.prestige.infiniteLevel === 2, 'nível da Ressonância Infinita incrementa corretamente e não tem limite superior fixo');
var custoNivel3 = PrestigeLogic.getInfiniteCost();
__assert(custoNivel3 > custoNivel2, 'o custo da Ressonância Infinita cresce a cada nível');

// 24) conquistas novas: geradas corretamente e sem duplicar IDs
var idsUnicos = {};
var duplicado = false;
ACHIEVEMENTS_DATA.forEach(a => {
  if (idsUnicos[a.id]) duplicado = true;
  idsUnicos[a.id] = true;
});
__assert(!duplicado, 'nenhum ID de conquista duplicado após a expansão v2');
__assert(ACHIEVEMENTS_DATA.length > 130, 'a quantidade total de conquistas aumentou significativamente na v2 (' + ACHIEVEMENTS_DATA.length + ' encontradas)');
__assert(ACHIEVEMENTS_DATA.some(a => a.id === 'arvore_completa'), 'nova conquista "Transcendido" (árvore completa) existe');

gameState.buildings = {};
BUILDINGS_DATA.forEach(b => gameState.buildings[b.id] = { owned: 1 });
AchievementsLogic.checkAll();
__assert(gameState.achievementsUnlocked['colecionador_de_produtores'] === true, 'conquista "Um Pouco de Tudo" desbloqueia ao possuir todos os 28 produtores');

// 25) save antigo (formato v1, sem os campos novos) continua carregando sem erros
var saveAntigoV1 = {
  saveVersion: 1,
  regis: Decimal.fromNumber(500).toJSON(),
  totalRegisEarned: Decimal.fromNumber(500).toJSON(),
  buildings: { cliqueiro: { owned: 3 } },
  upgradesBought: {},
  achievementsUnlocked: {},
  prestige: { celestial: Decimal.ZERO.toJSON(), ascensions: 0, permanentUpgrades: {} }
  // note: sem totalRegisThisAscension, sem prestige.infiniteLevel, sem account, sem stats novos
};
Save._applyLoadedState(saveAntigoV1);
__assert(StateGetters.buildingOwned('cliqueiro') === 3, 'save v1 antigo preserva produtores existentes');
__assert(gameState.prestige.infiniteLevel === 0, 'save v1 antigo recebe prestige.infiniteLevel padrão (0) sem erros');
__assert(gameState.buildings['eco_do_criador'] !== undefined, 'save v1 antigo recebe os novos produtores transcendentais com 0 unidades');
__assert(gameState.account && gameState.account.linkedUid === null, 'save v1 antigo recebe o novo campo "account" com valor padrão seguro');
__assert(gameState.saveVersion === 2, 'save antigo é migrado para a versão atual (2)');

console.log('\\nTODOS OS TESTES DE FUMAÇA PASSARAM (' + __passCount() + ' verificações).');
`;

sandbox.__passCount = () => passCount;
vm.runInContext(testScript, sandbox, { filename: 'smoke-assertions.js' });
