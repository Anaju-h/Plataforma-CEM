# Recuperação de frontend SOL/ORC

Referência consultada: **f7c7a22**, anterior ao backend. `b32e574` e HEAD não foram usados como baseline visual. O estado atual de backend/API/SQL foi preservado. Nenhum reset, revert, restore, checkout de arquivos ou substituição integral pela versão antiga foi feito.

## Auditoria e classificação

Foram executados `git status` e `git diff f7c7a22 -- frontend` antes das alterações. A revisão inclui arquivos versionados modificados e arquivos novos ainda não versionados. Categorias: A API, B persistência, C SOL→ORC, D correção técnica válida; E visual, F comportamento, G validação, H simplificação indevida, I alteração desnecessária.

| Arquivos auditados (relativos a frontend) | Classificação e resultado |
| --- | --- |
| `.env.example`, `vite.config.js` | A: URL e proxy da API preservados |
| `index.html`, `public/icon.png` | D: charset, título e favicon atuais preservados |
| `package.json` | D: comando de testes preservado |
| `src/styles/globals.css` | D: cursor, caret e scrollbar preservados; nenhuma alteração nesta correção |
| `src/styles/internalWorkspace.css` | D/E: preservada a composição aprovada; definidos os estilos faltantes dos controles e boxes SOL com os mesmos tokens dos componentes aprovados |
| `src/components/internal/NotificationBell.jsx` | A/F: preservados painel, navegação e fechamento; “Marcar lidas” agora aguarda a operação antes de atualizar |
| `src/components/internal/QuoteFilters.jsx` | A: apenas origem das opções, sem mudança visual |
| `src/components/internal/QuoteItemsEditor.jsx` | D/F: campos opcionais vindos da API aceitam null como string vazia, mantendo o editor controlado |
| `src/components/internal/proposal/ProposalConfigPanel.jsx` | A/F: persistência ao sair do campo preservada, prévia imediata recuperada e valor null tratado |
| `src/components/internal/ApiState.jsx` (novo) | A/D: tratamento compartilhado de carregamento/erro/retry usando tipografia, cores e caixas existentes |
| `src/pages/OrcamentoPage.jsx` | A/B: submissão pública e confirmação real preservadas; sem alteração nesta correção |
| `src/pages/internal/InternalNewRequestPage.jsx` | A/B: criação assíncrona preservada; estrutura visual e formulário continuam iguais à referência |
| `src/pages/internal/RequestsPage.jsx` | A/F/I: restaurado filtro de estados ativos; vazio não aparece durante carregamento/erro; cards, tabela, busca e botão mantidos |
| `src/pages/internal/RequestDetailPage.jsx` | A/B/C preservados; F/G corrigidos com validação, pendências, disabled e erros dentro dos modais; troca de ID remonta o estado para não exibir outra SOL |
| `src/pages/internal/MyWorkPage.jsx`, `TeamPage.jsx` | A/D: consultas reais preservadas; erro pode ser recuperado, com cabeçalho e caixa consistentes; conteúdo carregado preservado |
| `src/pages/internal/OperationalHistoryPage.jsx` | A/F: diferencia carregando/vazio/erro, limpa erro após sucesso, permite retry e não exibe resultado anterior como resposta de uma consulta falha |
| `src/pages/internal/QuotesPage.jsx` | A/C: lista real preservada; carregamento/erro com cabeçalho e caixa; ausência de ação de Projeto mantida |
| `src/pages/internal/QuoteDetailPage.jsx` | A/B/C preservados; F/H corrigidos: salvar não remove controles nem muda o formulário para modo de consulta temporariamente; fieldset bloqueia alterações durante mutation |
| `src/pages/internal/ProposalBuilderPage.jsx` | A/B preservados; F corrigido: prévia local acompanha digitação, emissão bloqueada enquanto nota não persistiu, retry de salvamento e proteção para documento ausente |
| `src/pages/internal/ProjectDetailPage.jsx` | A: somente import legado isolado; sem implementação de Projeto ou alteração adicional |
| `src/services/requestApi.js` | A/B: transporte real preservado; sem alteração nesta correção |
| `src/services/requestService.js` | A/B preservados; F/G: validação antes da mutation e apresentação de requestNeed a partir do ID persistido |
| `src/services/workflowValidation.js` | G/D: regras puras compartilhadas para formulário, modal e fachada |
| `src/services/quoteApi.js`, `quoteService.js`, `quotePieceService.js`, `src/hooks/useQuote.js` | A/B/C: API, estados, snapshots das peças e ausência de fallback preservados |
| `src/services/proposalService.js` | A/B: persistência, revisão, versões e PDF mantidos |
| `src/services/demoQuoteService.js`, `demoProposalService.js` | A/D: legado isolado para módulos não migrados; nunca fonte das rotas reais SOL/ORC |
| `src/services/projectService.js`, `src/services/customer/customerService.js` | A/D: imports de compatibilidade preservados; sem expansão desses módulos |
| `src/services/notificationService.js`, `operationalHistoryService.js`, `teamService.js`, `workService.js` | A/C: consultas assíncronas e vínculos reais preservados; notificações continuam sem backend próprio |
| `tests/currentUser.test.mjs`, `internalExperience.test.mjs`, `operationalFlow.test.mjs`, `proposal.test.mjs`, `proposalVisual.test.mjs`, `quoteItems.test.mjs` | D: fixtures legadas separadas das rotas reais; expectativas do Histórico corrigidas para carregamento inicial |
| `tests/requestApi.test.mjs`, `requestArchitecture.test.mjs`, `quoteApi.test.mjs` | A/D: contratos reais e proteção contra fallback preservados |
| `tests/requestRegression.test.mjs` (novo), `quoteBrowser.mjs` | D: regressões de validação, adaptação, UI e fluxo persistido cobertas |

Também foram conferidos `ProjectsPage`, layouts internos/Cliente, formulário `QuoteForm`, componentes de filtros SOL, `RequestDetailSection`, `ValidationFeedback`, demais componentes do Builder e `proposal.css`: não sofreram mudanças desde a referência que justificassem restauração. Não foram substituídos ou redesenhados.

## Constatações por integração

**SOL:** remoção das guardas do serviço em memória deixou payloads inválidos chegarem à API; perda da adaptação `requestNeed` ocultou nome/fluxo da necessidade; filtros passaram a oferecer estados arquivados numa fila ativa; operações assíncronas introduziram corrida ao marcar notificações lidas, erros sem retry e estados vazios prematuros. Essas diferenças foram corrigidas sem recuperar os repositórios locais.

**ORC:** o estado busy passou a ocultar botões e a tratar o editor como somente leitura durante o salvamento; a nota comercial deixou de atualizar a prévia durante a digitação; campos opcionais null geraram avisos de componentes controlados. Essas diferenças foram corrigidas mantendo API, revisões e persistência.

Precisão sobre a referência: o markup principal de SOL e seus cards não tinham sido removidos. As classes `internal-input`, `internal-primary-button`, `internal-secondary-button`, `internal-card`, `internal-soft-panel` e `internal-soft-chip` já eram usadas em f7c7a22 **sem definições CSS correspondentes**. A correção completa essas definições seguindo os contornos, fundos, radius, espaçamento e cores dos componentes aprovados existentes. Da mesma forma, a referência validava a conclusão no serviço, mas não tinha disabled e indicação de pendências completos no formulário/modal; estes foram conectados às mesmas regras conforme solicitado. Não se atribui essas lacunas preexistentes falsamente às integrações.

## Regras de análise e estados

- Resumo técnico não vazio após trim: obrigatório para todos os resultados.
- Informações pendentes: obrigatórias somente para “Aguardar informações”.
- Motivo técnico da recusa: obrigatório somente para “Recusar solicitação”.
- Complexidade e tecnologia continuam opcionais, como nas regras existentes; não foram inventadas restrições.
- “Concluir análise”: habilitado apenas em “Em análise”, com resumo válido e sem operação em andamento. Em espera, primeiro se usa “Retomar análise”.
- “Confirmar resultado”: habilitado apenas quando os requisitos do resultado selecionado estão preenchidos e não há mutation em andamento.
- Cancelamento: motivo não vazio; operações duplicadas bloqueadas durante salvamento.
- Backend continua validando independentemente; nenhum DTO, endpoint, migration ou serviço backend foi alterado para contornar a UI.

## Preservação do escopo

Mantidos Quarkus, SQL Server, Flyway, MapStruct, Hibernate, migrations, sequences, endpoints, bancos, isolamento TEST/DEV, vínculo recíproco SOL↔ORC e proteção de duplicidade. Nenhuma rota real usa mocks/runtime/localStorage como fonte. Estado local não salvo de formulário e prévia não substitui o SQL; emissão do PDF exige nota persistida. Projeto e Cliente continuam fora da integração; a ausência de criação local de Projeto a partir de ORC real é intencional e foi mantida.

## Validação

Resultados finais registrados após executar a versão corrigida. Testes de navegador usam exclusivamente a API em 8081 conectada a `lab_platform_test`; nenhum fixture é enviado à API DEV em 8080. Capturas ficam em `backend/target/regression-sol-analysis.png`, `regression-orc-detail.png` e `regression-proposal-builder.png`.

### Encerramento da continuação — 23/09/2026

A interrupção ocorreu depois das correções de produção, enquanto se estabilizava a automação de recarga do navegador. Já estavam corrigidos a validação SOL, estilos dos controles/boxes, classificação da necessidade, filtros, estados assíncronos, corrida de notificações, estado de salvamento ORC e prévia comercial. O teste passou a aguardar o documento novo após F5, evitando ler o DOM antigo durante a navegação.

Nesta última continuação foram conferidos status/diff atuais, concluída a execução de navegador pendente, revisadas suas capturas de desktop e executada uma rodada final de testes/lint/build. **Nenhum arquivo de produção precisou de nova alteração.** O único arquivo editado após a solicitação de continuação foi este relatório.

| Verificação final | Resultado |
| --- | --- |
| SOL no navegador | Aprovada: abrir, iniciar análise, bloquear resumo vazio sem POST, preencher, aguardar informações, F5, retomar, concluir apta, F5; cancelamento com motivo e histórico |
| SOL → ORC | Aprovada em TEST: SOL-0085 → ORC-0034, vínculo/status recíprocos, duplicidade retorna o mesmo ORC, lista real, editar/salvar/F5 |
| Proposal Builder | Aprovado: ORC real, prévia acompanha digitação, nota persistida após F5; captura desktop revisada |
| Meu Trabalho / Equipe / Histórico | Páginas carregadas com consultas reais, mantendo estrutura aprovada |
| API indisponível | SOL e ORC exibem erro/retry, sem registros mock; retry recupera os dados persistidos |
| Testes frontend | `node --test --test-concurrency=1 tests/*.test.mjs`: **55 aprovados, zero falhas/skips**, exit 0 |
| Lint | ESLint restrito aos 14 arquivos JS/JSX de produção tocados na recuperação: **exit 0**; nenhum lint histórico fora do escopo |
| Build frontend | `npm run build`: **exit 0**; aviso de tamanho de bundle continua sem bloquear o build |
| Auditoria final | `git diff f7c7a22 -- frontend` revisado e salvo em `backend/target/frontend-final.diff`; `git diff --check`: **exit 0** |

O teste foi executado serialmente porque múltiplos servidores Vite dos testes disputaram o cache no Windows na primeira rodada paralela; não foi alterada a implementação para esconder falhas de teste.

DEV não recebeu fixtures nem mutations desta recuperação. Consulta somente leitura confirmou **duas SOLs, zero ORCs**, última alteração de SOL/histórico às **08:24:28 de 23/09/2026 (11:24:28 UTC)**, anterior à recuperação. O hash da missão ORC anterior não coincide devido a essa alteração anterior; não foi apresentado como prova de igualdade atual. A configuração do processo da API 8081 foi conferida explicitamente como `databaseName=lab_platform_test`. Nenhuma limpeza de banco ocorreu.

Não há regressão funcional/visual identificada ainda pendente no escopo auditado. Notificações reais, Projeto backend e demais módulos futuros não foram implementados. A baseline foi usada apenas para consulta e mesclagem seletiva; não houve reset/revert/restore nem substituição integral de arquivos.
