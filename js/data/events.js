/**
 * data/events.js — eventos aleatórios do Régis Clicker.
 * weight = peso relativo de sorteio (maior = mais comum).
 * effect.type: 'production_mult' | 'click_mult' | 'instant_regis' | 'production_penalty'
 */

const EVENTS_DATA = [
  {
    id: 'regis_dourado',
    name: 'Régis Dourado',
    icon: '🌟',
    weight: 100,
    rare: false,
    lifetimeSeconds: 13,
    messages: ['Um Régis Dourado apareceu! Clique rápido!'],
    rollEffects: [
      { effect: { type: 'production_mult', value: 7, duration: 77 }, weight: 30, text: 'Produção x7 por 77 segundos!' },
      { effect: { type: 'click_mult', value: 7, duration: 30 }, weight: 30, text: 'Clique x7 por 30 segundos!' },
      { effect: { type: 'instant_regis', secondsWorth: 60 }, weight: 25, text: 'Você recebeu uma grande quantidade instantânea de Régis!' },
      { effect: { type: 'production_penalty', value: 0.5, duration: 10 }, weight: 15, text: 'Ops! Produção reduzida temporariamente...' }
    ]
  },
  {
    id: 'regis_frenetico',
    name: 'Régis Frenético',
    icon: '🔥',
    weight: 45,
    rare: false,
    lifetimeSeconds: 10,
    messages: ['Régis Frenético! A produção está saindo de controle!'],
    rollEffects: [
      { effect: { type: 'production_mult', value: 12, duration: 45 }, weight: 100, text: 'Produção x12 por 45 segundos!' }
    ]
  },
  {
    id: 'clique_insano',
    name: 'Clique Insano',
    icon: '💫',
    weight: 45,
    rare: false,
    lifetimeSeconds: 10,
    messages: ['Clique Insano! Seus dedos não vão acreditar!'],
    rollEffects: [
      { effect: { type: 'click_mult', value: 15, duration: 30 }, weight: 100, text: 'Clique x15 por 30 segundos!' }
    ]
  },
  {
    id: 'regis_maluco',
    name: 'Régis Maluco',
    icon: '🤪',
    weight: 12,
    rare: true,
    lifetimeSeconds: 8,
    messages: ['Régis Maluco! Ninguém sabe o que vai acontecer.'],
    rollEffects: [
      { effect: { type: 'production_mult', value: 25, duration: 60 }, weight: 50, text: 'Produção x25 por 60 segundos! Que loucura!' },
      { effect: { type: 'click_mult', value: 50, duration: 25 }, weight: 50, text: 'Clique x50 por 25 segundos! Isso é maluquice!' }
    ]
  },
  {
    id: 'regis_invertido',
    name: 'Régis Invertido',
    icon: '🙃',
    weight: 10,
    rare: true,
    lifetimeSeconds: 8,
    messages: ['Régis Invertido apareceu de cabeça para baixo!'],
    rollEffects: [
      { effect: { type: 'instant_regis', secondsWorth: 300 }, weight: 100, text: 'De alguma forma, isso rendeu MUITO Régis instantâneo.' }
    ]
  },
  {
    id: 'regis_dourado_gigante',
    name: 'Régis Dourado Gigante',
    icon: '🌞',
    weight: 6,
    rare: true,
    lifetimeSeconds: 7,
    messages: ['REGIS DOURADO GIGANTE! Isso é raríssimo!'],
    rollEffects: [
      { effect: { type: 'production_mult', value: 50, duration: 90 }, weight: 50, text: 'Produção x50 por 90 segundos!!' },
      { effect: { type: 'instant_regis', secondsWorth: 900 }, weight: 50, text: 'Uma quantidade absurda de Régis surgiu do nada!' }
    ]
  },
  {
    id: 'regis_cosmico',
    name: 'Régis Cósmico',
    icon: '🌌',
    weight: 2,
    rare: true,
    lifetimeSeconds: 6,
    messages: ['O RÉGIS CÓSMICO desceu dos céus. Isso quase nunca acontece.'],
    rollEffects: [
      { effect: { type: 'production_mult', value: 100, duration: 120 }, weight: 40, text: 'Produção x100 por 2 minutos inteiros!' },
      { effect: { type: 'click_mult', value: 100, duration: 60 }, weight: 30, text: 'Clique x100 por 60 segundos!' },
      { effect: { type: 'instant_regis', secondsWorth: 3600 }, weight: 30, text: 'Uma hora inteira de produção, entregue instantaneamente!' }
    ]
  }
];

const COMBINED_EVENT_NAME = 'Combo Absurdo';
