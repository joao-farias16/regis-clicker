# Régis Clicker

Um jogo incremental (clicker) completo, no espírito de Cookie Clicker, mas com
identidade, conteúdo, arte e humor 100% próprios. O recurso principal do jogo
é o **Régis**.

## Descrição

Clique no Régis, compre produtores, desbloqueie upgrades, viva eventos
aleatórios (alguns raríssimos), ascenda para acumular Régis Celestiais e
desbloqueie uma árvore de upgrades permanentes. Contém progressão offline,
conquistas, colecionáveis, desafios e muito mais.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem build step)
- Sistema próprio de números gigantes (`js/numbers.js`) para lidar com valores
  muito além do limite seguro de `Number` do JavaScript, sem gerar `NaN` ou
  `Infinity`
- `localStorage` para salvamento (com backup automático)
- `requestAnimationFrame` com cálculo por *delta time* para o game loop
- Áudio 100% sintetizado via Web Audio API (nenhum arquivo de som externo)
- Node.js é **opcional** — usado apenas para servir os arquivos localmente e
  evitar problemas de CORS ao abrir `index.html` diretamente.

## Como instalar

Não há dependências reais de produção. Se quiser usar o script `dev`
(recomendado, evita problemas de CORS em alguns navegadores):

```bash
npm install
```

(Não há pacotes para instalar de fato — este comando só garante que o
ambiente Node está pronto para rodar o `npx http-server` usado no passo
seguinte.)

## Como executar

**Opção recomendada (servidor local):**

```bash
npm run dev
```

Depois abra `http://localhost:8080` no navegador.

**Opção alternativa (sem Node.js):**

Basta abrir o arquivo `index.html` diretamente no navegador. Em alguns
navegadores/configurações isso pode gerar avisos de CORS ao carregar os
módulos JavaScript — se isso acontecer, use a opção do servidor local acima.

## Como jogar

1. Clique no botão **RÉGIS** no centro da tela para gerar Régis manualmente.
2. Use os Régis para comprar **produtores** (painel da esquerda), que geram
   Régis automaticamente a cada segundo.
3. Compre **upgrades** (aba "Upgrades") para multiplicar sua produção e o
   valor do seu clique.
4. Fique de olho em **Régis Dourados** e outros eventos que aparecem
   aleatoriamente na área de clique — clique neles rapidamente para ganhar
   bônus temporários ou Régis instantâneo.
5. Quando tiver Régis suficientes, vá até a aba **Prestígio** e **ascenda**
   para trocar seu progresso atual por **Régis Celestiais**, usados numa
   árvore de upgrades permanentes.
6. Acompanhe **Conquistas**, **Coleção**, **Desafios** e **Estatísticas** nas
   abas correspondentes.
7. Feche o navegador sem medo: o jogo salva automaticamente e calcula sua
   produção **offline** quando você voltar.

## Estrutura de pastas

```
Regis-Clicker/
├── index.html          → shell principal, carrega todos os módulos JS em ordem
├── style.css            → todo o visual do jogo (tema escuro/claro, responsivo)
├── favicon.svg          → ícone próprio (letra "R" estilizada)
├── package.json         → scripts de execução local (sem dependências reais)
├── README.md
└── js/
    ├── utils.js          → funções utilitárias genéricas
    ├── numbers.js        → sistema de números gigantes (classe Decimal) + formatação
    ├── state.js          → estado central do jogo (gameState) + acessores
    ├── economy.js         → cálculo centralizado de CPS, clique, combo, custos
    ├── buildings.js        → lógica de compra de produtores
    ├── upgrades.js         → lógica de desbloqueio/compra de upgrades
    ├── achievements.js       → verificação e desbloqueio de conquistas
    ├── prestige.js          → ascensão e árvore de prestígio
    ├── events.js            → eventos aleatórios (Régis Dourado e variantes) e buffs
    ├── offline.js            → cálculo de progresso offline
    ├── save.js               → salvar/carregar/exportar/importar/autosave
    ├── settings.js            → configurações do jogador
    ├── audio.js               → efeitos sonoros sintetizados (Web Audio API)
    ├── notifications.js       → sistema de notificações (toasts)
    ├── ui.js                  → toda a renderização de DOM e interações visuais
    ├── main.js                → inicialização, game loop e ligação de eventos
    └── data/
        ├── buildings.js       → dados dos 20 produtores
        ├── upgrades.js        → dados de dezenas de upgrades (+ geração automática)
        ├── achievements.js    → dados de mais de 100 conquistas
        ├── events.js          → dados dos eventos aleatórios/raros
        ├── prestige.js        → dados da árvore de prestígio
        └── content.js         → colecionáveis, desafios e mensagens de sabor
```

A separação entre **dados** (pasta `js/data/`) e **lógica** (arquivos soltos
em `js/`) foi intencional: para adicionar um novo produtor, upgrade,
conquista ou evento, basta editar o array correspondente em `js/data/`, sem
tocar em nenhuma lógica de jogo.

## Como funciona o save

- O jogo salva automaticamente a cada 15 segundos em `localStorage`, além de
  salvar sempre que a aba perde o foco ou é fechada.
- Antes de cada novo salvamento, o save anterior é guardado como backup. Se o
  save principal estiver corrompido, o jogo tenta recuperar o backup
  automaticamente.
- **Exportar Save** (aba "Saves"): gera um código em Base64 contendo todo o
  seu progresso, que pode ser copiado e colado em outro navegador/computador.
- **Importar Save**: cole um código válido para restaurar o progresso. Códigos
  inválidos ou corrompidos são rejeitados com uma mensagem clara, sem travar
  o jogo.
- O save inclui um campo `saveVersion`, preparado para futuras migrações caso
  a estrutura de dados mude.

## Como hospedar

O projeto é 100% estático (HTML/CSS/JS), então funciona em qualquer serviço
de hospedagem estática:

**Vercel / Netlify**
1. Suba a pasta `Regis-Clicker` para um repositório no GitHub.
2. Crie um novo projeto na Vercel ou Netlify e conecte esse repositório.
3. Não é necessário configurar comando de build — apenas aponte o diretório
   raiz do projeto como diretório de publicação (não há passo de build).

**GitHub Pages**
1. Suba a pasta para um repositório no GitHub.
2. Vá em Settings → Pages, escolha a branch principal e a raiz (`/`) como
   fonte.
3. O jogo ficará disponível em `https://SEU_USUARIO.github.io/SEU_REPO/`.

## Como ativar o modo debug

Abra o console do navegador (F12) e use os comandos disponíveis em
`window.RegisDebug`:

```js
RegisDebug.enable();                 // liga a flag DEBUG
RegisDebug.addRegis(1e12);           // adiciona 1 trilhão de Régis
RegisDebug.addCelestial(50);         // adiciona 50 Régis Celestiais
RegisDebug.unlockAllUpgrades();      // desbloqueia todos os upgrades
RegisDebug.unlockAllAchievements();  // desbloqueia todas as conquistas
RegisDebug.forceEvent('regis_dourado'); // força o aparecimento de um evento
RegisDebug.cpsBreakdown();           // mostra no console de onde vem o CPS atual
RegisDebug.resetSave();              // apaga o progresso
```

O modo DEBUG **não** é ativado por padrão — é preciso chamar `enable()`
manualmente pelo console.

## Decisões de design (onde a especificação deixou espaço livre)

- **Eficiência offline**: começa em 50% da produção normal e pode chegar a
  100% com upgrades específicos, seguindo a convenção comum de jogos
  incrementais (produção offline nunca é totalmente gratuita, senão o botão
  de clicar perderia sentido).
- **Fórmula de prestígio**: `celestiais = floor((totalRegis / 1e12) ^ (1/2.2))`,
  configurável em `js/data/prestige.js` (`PRESTIGE_CONFIG`). Gera uma curva de
  progressão que recompensa ascender periodicamente sem tornar ascensões
  triviais nem impossíveis.
- **"Leite" de conquistas**: cada conquista desbloqueada concede +0,1% de
  bônus de produção permanente e cumulativo (chamado internamente de "Leite
  de Régis"), dando função prática a conquistas cosméticas/engraçadas.
- **Combos combináveis**: quando um buff de produção e um de clique estão
  ativos ao mesmo tempo, o jogo anuncia um "Combo Absurdo" (efeito
  cosmético/narrativo) além de aplicar os dois multiplicadores normalmente.
- **Custo dos produtores**: fórmula geométrica padrão
  `custo = custoBase × fator^quantidade`, com fator configurável por produtor
  em `js/data/buildings.js` (atualmente 1.15 para todos, mas pode variar).

## Testes realizados

Antes da entrega, foram verificados manualmente:

- Clique manual e cálculo de valor de clique (base, upgrades, combo, buffs)
- Produção automática (CPS) com múltiplos produtores e multiplicadores
  simultâneos
- Compra unitária, x10, x100 e "MÁXIMO" de produtores, incluindo o cálculo de
  quantas unidades cabem no saldo atual (via busca binária para números
  extremamente grandes)
- Compra de upgrades normais, incluindo bloqueio de recompra
- Sistema de eventos aleatórios (Régis Dourado, eventos raros, efeitos
  positivos e o efeito negativo de produção reduzida)
- Sistema de buffs combináveis ("Combo Absurdo")
- Ascensão: cálculo de Régis Celestiais, reset de progresso temporário,
  manutenção de upgrades permanentes
- Árvore de prestígio: pré-requisitos, custos, compra
- Desbloqueio de conquistas (incluindo condições manuais/secretas) e
  colecionáveis
- Desafios opcionais
- Salvamento automático, backup de save corrompido, exportação e importação
  (incluindo rejeição de códigos inválidos sem travar o jogo)
- Progresso offline (cálculo de tempo decorrido e Régis gerados, com trava de
  segurança de 14 dias)
- Configurações (som, música, animações, números compactos, alto contraste,
  tema claro/escuro) persistindo corretamente
- Responsividade em larguras de tela pequenas (layout de colunas vira layout
  empilhado)
- Ausência de `NaN`/`Infinity` mesmo em números extremamente grandes (testado
  manualmente multiplicando o sistema `Decimal` centenas de vezes)
- Todos os arquivos JavaScript foram validados com `node --check` para
  garantir ausência de erros de sintaxe

## Créditos

Projeto desenvolvido com Claude (Anthropic) como um exercício completo de
jogo incremental. Todo o conteúdo textual, nomes, ícones (emoji) e sistema de
números é original, criado especificamente para o Régis Clicker.
