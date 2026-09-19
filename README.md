# Régis Clicker

Um jogo incremental (clicker) completo, no espírito de Cookie Clicker, mas com
identidade, conteúdo, arte e humor 100% próprios. O recurso principal do jogo
é o **Régis**.

## Descrição

Clique no Régis, compre produtores, desbloqueie upgrades, viva eventos
aleatórios (alguns raríssimos), ascenda para acumular Régis Celestiais e
desbloqueie uma árvore de upgrades permanentes. Contém progressão offline,
conquistas, colecionáveis, desafios e muito mais.

## Atualização v2 — resumo

Esta versão é uma **evolução** do Régis Clicker original — nada foi removido
ou recriado do zero. Principais mudanças:

1. **Sistema de login real** (opcional): Firebase Authentication + Firestore
   para conta e sincronização de save em nuvem, mantendo o localStorage como
   mecanismo principal e fallback (veja "Como ativar o login" abaixo).
2. **Prestígio rebalanceado**: corrigido um exploit em que era possível
   ascender repetidamente com ganhos triviais. Agora o requisito cresce a
   cada ascensão (veja "Rebalanceamento do prestígio" abaixo).
3. **Conteúdo expandido**: 8 novos produtores late-game, ~50 novos upgrades
   (incluindo sinergias entre produtores e bônus por categoria), 10 novos
   upgrades celestiais + 1 upgrade celestial repetível/infinito, e mais de
   40 novas conquistas.
4. **Mobile**: correção do zoom por duplo toque, do contorno azul ao tocar
   botões, reordenação do layout (o botão de clicar vem primeiro em telas
   estreitas) e mais breakpoints responsivos.
5. **Compatibilidade**: saves antigos (v1) continuam carregando normalmente —
   todos os campos novos recebem valores padrão automaticamente.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem build step)
- Sistema próprio de números gigantes (`js/numbers.js`) para lidar com valores
  muito além do limite seguro de `Number` do JavaScript, sem gerar `NaN` ou
  `Infinity`
- `localStorage` para salvamento (com backup automático) — continua sendo a
  fonte de verdade principal do progresso, com ou sem login
- **Firebase Authentication + Firestore** (opcional): usados apenas para
  login real e espelhamento do save na nuvem. Carregados via um módulo ES
  isolado (`js/firebase-bridge.mjs`) que nunca bloqueia o carregamento do
  jogo, mesmo sem internet ou sem configuração

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
    ├── firebase-config.js  → credenciais do Firebase (login/nuvem), opcional (v2)
    ├── firebase-bridge.mjs  → módulo ES isolado que carrega o SDK do Firebase (v2)
    ├── auth.js               → sistema de login: estados, e-mail/senha, sync (v2)
    ├── utils.js          → funções utilitárias genéricas
    ├── numbers.js        → sistema de números gigantes (classe Decimal) + formatação
    ├── state.js          → estado central do jogo (gameState) + acessores + migração de save
    ├── economy.js         → cálculo centralizado de CPS, clique, combo, custos, sinergias e categorias
    ├── buildings.js        → lógica de compra de produtores
    ├── upgrades.js         → lógica de desbloqueio/compra de upgrades
    ├── achievements.js       → verificação e desbloqueio de conquistas
    ├── prestige.js          → ascensão, árvore de prestígio e Ressonância Infinita
    ├── events.js            → eventos aleatórios (Régis Dourado e variantes) e buffs
    ├── offline.js            → cálculo de progresso offline
    ├── save.js               → salvar/carregar/exportar/importar/autosave (+ espelho na nuvem)
    ├── settings.js            → configurações do jogador + tela cheia (v2)
    ├── audio.js               → efeitos sonoros sintetizados (Web Audio API)
    ├── notifications.js       → sistema de notificações (toasts)
    ├── ui.js                  → toda a renderização de DOM e interações visuais
    ├── main.js                → inicialização, game loop e ligação de eventos
    └── data/
        ├── buildings.js       → dados dos 28 produtores (20 originais + 8 transcendentais)
        ├── upgrades.js        → dados de mais de 150 upgrades (+ geração automática)
        ├── achievements.js    → dados de mais de 130 conquistas
        ├── events.js          → dados dos eventos aleatórios/raros
        ├── prestige.js        → dados da árvore de prestígio (25 nós) + Ressonância Infinita
        └── content.js         → colecionáveis, desafios e mensagens de sabor
```

A separação entre **dados** (pasta `js/data/`) e **lógica** (arquivos soltos
em `js/`) foi intencional: para adicionar um novo produtor, upgrade,
conquista ou evento, basta editar o array correspondente em `js/data/`, sem
tocar em nenhuma lógica de jogo. Essa separação já existia na v1 e foi
mantida integralmente na v2 — todo o conteúdo novo foi encaixado nela.

## Rebalanceamento do prestígio

**O problema (v1):** o ganho de Régis Celestiais era calculado sobre
`totalRegisEarned`, um contador **vitalício que nunca resetava**, nem mesmo
ao ascender. Como qualquer produção residual (mesmo poucos segundos) fazia
esse total vitalício crescer, bastava esperar um pouco após cada ascensão
para poder ascender de novo, quase sem esforço — permitindo aumentar o nível
de prestígio rapidamente sem progressão real.

**A correção (v2):**

1. O cálculo agora usa `totalRegisThisAscension` — o Régis produzido **desde
   a última ascensão**, que reseta a cada ascensão (esse campo já existia no
   save da v1 como estatística; a v2 passou a usá-lo como base do cálculo).
   Como produtores também resetam na ascensão, o jogador precisa reconstruir
   sua produção genuinamente antes de conseguir ascender de novo.
2. O divisor da fórmula (`PRESTIGE_CONFIG.divisor`, base 1 trilhão) agora
   cresce geometricamente a cada ascensão já realizada
   (`divisorGrowth = 1.55`, em `js/data/prestige.js`): a 2ª ascensão exige um
   divisor ~55% maior que a 1ª, a 3ª ~140% maior, e assim por diante. Isso
   cria a curva pedida — ascensão inicial acessível, ascensões seguintes
   progressivamente mais exigentes — sem usar um número fixo arbitrário.
3. Para compensar a maior exigência, o bônus permanente por ascensão subiu de
   2% para 3% de produção global por ascensão (`Economy.getGlobalProductionMultiplier`),
   e um novo upgrade celestial ("Arquivo das Ascensões") pode aumentar esse
   percentual ainda mais.
4. Para o late game (depois de comprar toda a árvore celestial), a
   **Ressonância Celestial Infinita** é um upgrade repetível sem limite: cada
   nível custa mais que o anterior (`baseCost × 1.35^nível`) e concede +5% de
   produção global permanente, garantindo que Régis Celestiais gastos sempre
   tenham utilidade, mesmo após "terminar" a árvore.

A fórmula continua usando o sistema `Decimal` em todos os pontos relevantes,
e o cálculo tem um fallback logarítmico para totais astronomicamente grandes
(evitando `Infinity`), exatamente como na v1.

## Como funciona o save

- O jogo salva automaticamente a cada 15 segundos em `localStorage`, além de
  salvar sempre que a aba perde o foco ou é fechada. **Isso não mudou na v2**
  — o localStorage continua sendo a fonte de verdade principal do progresso,
  com ou sem login.
- Antes de cada novo salvamento, o save anterior é guardado como backup. Se o
  save principal estiver corrompido, o jogo tenta recuperar o backup
  automaticamente.
- **Exportar Save** (aba "Saves"): gera um código em Base64 contendo todo o
  seu progresso, que pode ser copiado e colado em outro navegador/computador.
- **Importar Save**: cole um código válido para restaurar o progresso. Códigos
  inválidos ou corrompidos são rejeitados com uma mensagem clara, sem travar
  o jogo.
- O save inclui um campo `saveVersion` (agora `2`), usado por
  `Save.migrate()` + `ensureStateIntegrity()` em `js/state.js` para
  preencher automaticamente qualquer campo novo em saves antigos (produtores
  transcendentais, `prestige.infiniteLevel`, `account`, etc.) **sem apagar
  nada do progresso existente**. Um save da v1 é 100% compatível com a v2.
- **Sincronização em nuvem (v2, opcional)**: se o jogador estiver logado,
  `Save.save()` também tenta espelhar o estado atual no Firestore, de forma
  assíncrona e best-effort — uma falha de rede aqui nunca impede nem atrasa o
  salvamento local. Ao logar em um dispositivo onde já existe um save na
  nuvem, o jogo pergunta explicitamente qual versão manter (local ou nuvem)
  antes de sobrescrever qualquer coisa.

## Como ativar o login (opcional)

O sistema de login é **real e funcional**, não uma simulação — mas por o
projeto ser hospedado como site estático (sem servidor próprio), ele depende
de um serviço externo gratuito para funcionar: o **Firebase** (Google), que
oferece autenticação e um banco de dados (Firestore) inteiramente via
chamadas do navegador, sem precisar de backend próprio.

**Sem configurar nada, o jogo funciona 100% normalmente em modo convidado**
(apenas localStorage, como na v1). Para ativar login de verdade:

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto (gratuito).
2. Vá em **Build → Authentication → Get started** e ative o provedor
   **E-mail/senha**.
3. Vá em **Build → Firestore Database → Create database** → escolha "Start
   in production mode".
4. Nas regras do Firestore (aba "Rules"), use algo como:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /saves/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
   Isso garante que cada jogador só possa ler/escrever o **próprio** save.
5. Vá em **Project settings** (ícone de engrenagem) → role até "Your apps" →
   clique no ícone **"</>"** (Web) → registre um app → copie o objeto
   `firebaseConfig` exibido.
6. Cole esses valores em `js/firebase-config.js` (substituindo os campos
   vazios).
7. Publique/hospede normalmente (veja "Como hospedar" abaixo) — nenhuma outra
   mudança é necessária.

**Sobre segurança:** as chaves em `firebase-config.js` (apiKey, authDomain
etc.) são seguras para ficar no frontend — é assim que o Firebase é
projetado para funcionar; elas não são senhas. A segurança de fato vem das
Regras de Segurança do Firestore acima. Nenhuma senha de jogador passa por
esse arquivo — o Firebase Authentication cuida disso do lado do Google.

**Compatibilidade com a Vercel:** como o Firebase funciona inteiramente via
chamadas do navegador (sem servidor próprio), não é necessário configurar
variáveis de ambiente na Vercel nem alterar o processo de build — basta
preencher `js/firebase-config.js` antes do deploy, exatamente como qualquer
outro arquivo estático do projeto.

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
- **Fórmula de prestígio (atualizada na v2)**:
  `celestiais = floor((totalRegisThisAscension / divisorEfetivo) ^ (1/2.2))`,
  onde `divisorEfetivo = 1e12 × 1.55^ascensões`. Ver seção "Rebalanceamento
  do prestígio" acima para o raciocínio completo por trás da mudança.
- **"Leite" de conquistas**: cada conquista desbloqueada concede +0,1% de
  bônus de produção permanente e cumulativo (chamado internamente de "Leite
  de Régis"), dando função prática a conquistas cosméticas/engraçadas.
- **Combos combináveis**: quando um buff de produção e um de clique estão
  ativos ao mesmo tempo, o jogo anuncia um "Combo Absurdo" (efeito
  cosmético/narrativo) além de aplicar os dois multiplicadores normalmente.
- **Custo dos produtores**: fórmula geométrica padrão
  `custo = custoBase × fator^quantidade`, com fator configurável por produtor
  em `js/data/buildings.js` (atualmente 1.15 para todos, mas pode variar).
- **Categorias e sinergias (v2)**: cada produtor recebeu um campo `category`
  (`raiz`, `industrial`, `tecnologico`, `cosmico`, `transcendental`), usado
  por upgrades de categoria (`category_mult`) e por futuras conquistas de
  conjunto. Sinergias (`synergy_mult`) foram implementadas como um bônus
  percentual por unidade de outro produtor, somado em `Economy.getBuildingMultiplier`
  — escolhido por ser puramente aditivo à arquitetura de efeitos já existente,
  sem exigir uma reescrita do sistema de multiplicadores.
- **Login via Firebase (v2)**: escolhido especificamente por não exigir
  nenhum servidor próprio, mantendo o projeto 100% compatível com hospedagem
  estática (Vercel/Netlify/GitHub Pages). Ver seção "Como ativar o login".
- **Correção de zoom/contorno azul no mobile (v2)**: resolvida via
  `touch-action: manipulation` (que impede o gesto de double-tap-zoom sem
  desabilitar o pinch-zoom, preservando acessibilidade) e
  `-webkit-tap-highlight-color: transparent` combinado com `:focus-visible`
  (que remove o contorno de toque/clique mas mantém o contorno de foco por
  teclado) — em vez de desabilitar zoom ou foco por completo.

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

### Testes específicos da atualização v2

- Todos os 28 produtores existem, têm categoria definida e mantêm os valores
  originais dos 20 produtores anteriores (nada foi alterado neles)
- Upgrades de categoria (`category_mult`) e de sinergia (`synergy_mult`)
  aumentam corretamente a produção do(s) produtor(es) certo(s), sem afetar
  outros produtores
- **Correção do exploit de prestígio**: confirmado que, sem produção nova
  desde a última ascensão, o ganho de Régis Celestiais é zero mesmo com um
  total vitalício alto; e que o requisito (divisor efetivo) cresce a cada
  ascensão sucessiva
- Upgrade celestial repetível (Ressonância Infinita): bloqueado até completar
  a árvore, compra múltiplas vezes com custo crescente, sem limite superior
  fixo
- 156 upgrades e mais de 130 conquistas gerados sem IDs duplicados e sem
  referências a produtores inexistentes (validado programaticamente)
- **Compatibilidade de save**: um save simulado no formato v1 (sem os campos
  novos) foi carregado com sucesso, recebendo automaticamente
  `prestige.infiniteLevel`, os 8 produtores novos (com 0 unidades), o campo
  `account` e a versão de save atualizada — sem perder nenhum progresso
  existente
- Suíte de testes automatizados (`test/smoke.js`) expandida de 35 para 61
  verificações cobrindo todos os itens acima, todas passando
- Todos os arquivos referenciados em `index.html` (incluindo os novos
  `firebase-config.js` e `firebase-bridge.mjs`) foram servidos localmente e
  retornaram HTTP 200 — nenhuma referência quebrada
- Sistema de login testado nos estados: não configurado (modo convidado,
  padrão), carregando, autenticado e erro de credenciais — o jogo permanece
  100% jogável em qualquer um desses estados
- Revisão de CSS mobile: `touch-action: manipulation` e
  `-webkit-tap-highlight-color: transparent` aplicados a todos os elementos
  interativos; reordenação do layout em telas ≤1000px confirmada por
  inspeção do CSS gerado; breakpoints adicionais para telas ≤720px e ≤380px

**Limitação conhecida desta rodada de testes:** o ambiente usado para
desenvolver esta atualização não tem acesso a um navegador real nem aos
domínios do Firebase/CDN (apenas Node.js), então o fluxo de login não pôde
ser testado ponta a ponta contra um projeto Firebase real. Toda a lógica de
autenticação foi revisada e segue a API oficial do Firebase v10, mas
recomenda-se um teste manual rápido após preencher `firebase-config.js` (criar
conta, sair, entrar de novo, verificar que o save da nuvem aparece
corretamente).

## Créditos

Projeto desenvolvido com Claude (Anthropic) como um exercício completo de
jogo incremental. Todo o conteúdo textual, nomes, ícones (emoji) e sistema de
números é original, criado especificamente para o Régis Clicker.
