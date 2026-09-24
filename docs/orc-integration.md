# Integração real de ORC

## Auditoria anterior à implementação

O backend possuía apenas SOL: Resource, Service, Repository, entidades relacionais, DTOs, MapStruct e V1. O frontend já tinha as telas adequadas; nenhuma tela nova foi criada.

| Componente encontrado | Situação anterior | Situação final |
| --- | --- | --- |
| `QuotesPage.jsx` | Lista síncrona de `runtimeQuotes` | Lista consultada pela API, loading, erro e retry |
| `QuoteDetailPage.jsx` | Editor técnico/comercial com gravação em memória | Mesmo editor; composição, escopo, valores, condições e status persistidos |
| `RequestDetailPage.jsx` | Conversão de SOL real explicitamente bloqueada | Conversão transacional pelo backend e vínculo retornado pela API de SOL |
| `ProposalBuilderPage.jsx` | Documentos separados do ORC, guardados em `Map` | Rascunho e versões persistidos; prévia e PDF preservados |
| `quoteService.js` | Repositório em memória, normalização de demos e geração local de códigos | Fachada assíncrona de `quoteApi.js` |
| `quotePieceService.js` | Snapshot resumido com busca alternativa em solicitações demo | Apenas peças retornadas pelo ORC persistido |
| `quoteItemService.js` | Composição por peça/serviço, horas técnicas/cotadas e referência comercial | Cálculos e validações de edição preservados; servidor valida e calcula os totais persistidos |
| `data/internal/quotes.js` | Dados iniciais demo e filtros | Dados legados exclusivamente para módulos não migrados; filtros reais vêm da fachada |
| Meu Trabalho, Equipe e Histórico | Consultas de ORC em memória | Consultas de ORC pela API |

Não foi encontrado um fluxo de criação direta de ORC sem SOL. O botão da lista encaminhava à fila de solicitações. Portanto não há `POST /api/quotes` nem criação sem origem nesta missão.

## Modelo e migration

`V2__quotes.sql` adiciona `quote_code_seq` (`START WITH 1 INCREMENT BY 1`) e oito tabelas:

- `lab_quote`: UUID técnico, código operacional único, FK única à SOL, contato, origem, responsável, status, escopo, contexto técnico, condições, custo interno, datas e revisão para concorrência.
- `quote_service`: serviços de origem.
- `quote_piece`: cópia da identidade, quantidade e dados técnicos das peças.
- `quote_piece_service`: serviços de cada peça.
- `quote_item`: composição ordenada, vínculo à peça, equipamento, horas técnicas/cotadas, taxa adotada, referência comercial capturada e justificativa.
- `quote_history`: eventos gerados exclusivamente no servidor.
- `quote_proposal`: rascunho comercial, campos de conteúdo, opções e revisão própria.
- `quote_proposal_version`: versões comerciais, resultado registrado e snapshot imutável do documento.

Os relacionamentos, valores e textos operacionais são relacionais. JSON fica restrito aos requisitos/recomendações variáveis das peças e à representação configurável do documento comercial, opções de seções/mídias e metadados de entrega do PDF. Custos e justificativas internas não entram no snapshot comercial.

V1 não foi modificada. A migration não remove SOLs nem reinicia sequências existentes. Códigos são formatados no backend com mínimo de quatro dígitos, sem truncamento: `ORC-0001` e `ORC-10000`. Lacunas por rollback são normais em sequences.

## SOL → ORC, cópias e referências

A conversão recebe o código da SOL, obtém bloqueio pessimista e exige `Apta para orçamento`. Cria o ORC, peças, composição e histórico, registra `linkedQuoteId` e muda a SOL para `Convertida em orçamento` na mesma transação. Uma falha em qualquer gravação desfaz tudo.

Duplicidade é impedida tanto pelo bloqueio da SOL quanto por `UNIQUE(request_id)` no banco. Uma repetição retorna o ORC existente, sem gerar outro código. A FK composta de itens garante que a peça pertença ao mesmo ORC. Edições usam revisão e bloqueio: uma aba com dados antigos recebe conflito em vez de sobrescrever silenciosamente.

São copiados: empresa, contato, e-mail, telefone, necessidade, origem/canal, prioridade, responsável, objetivo, comentários, notas internas pertinentes, resumo/complexidade da análise, serviços, peças, quantidades, requisitos e recomendações. A referência comercial vigente é capturada por item; itens existentes conservam essa referência após edições. Totais são derivados dos itens no servidor.

Permanecem referenciados: a SOL por FK/UUID e código, seu histórico completo, metadados de anexos e detalhes adicionais da análise. Não há cópia indiscriminada do histórico da SOL nem transformação de anexos internos em mídia comercial.

## Endpoints

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/quotes` | Listar ORCs |
| GET | `/api/quotes/{id}` | Detalhe com composição, peças, histórico e proposta |
| POST | `/api/requests/{id}/quote` | Converter SOL de forma idempotente |
| PUT | `/api/quotes/{id}` | Salvar elaboração com revisão esperada |
| POST | `/api/quotes/{id}/status` | Revisão, aprovação, retorno e cancelamento |
| GET / POST | `/api/quotes/{id}/proposal` | Consultar / iniciar proposta |
| PUT | `/api/quotes/{id}/proposal` | Salvar rascunho |
| GET | `/api/quotes/{id}/proposal/document` | Prévia comercial calculada pelo servidor |
| POST | `/api/quotes/{id}/proposal/draft` | Criar explicitamente rascunho da próxima versão |
| POST | `/api/quotes/{id}/proposal/versions` | Registrar emissão validando revisão e snapshot |
| POST | `/api/quotes/{id}/proposal/versions/{number}/result` | Registrar aceite, recusa ou pedido de revisão |

Os identificadores das rotas continuam sendo os códigos operacionais, compatíveis com SOL. O UUID técnico também é retornado. Não existem endpoints de Projeto nesta implementação.

## Status e Proposal Builder

Foram encontrados: `Rascunho`, `Em elaboração`, `Em revisão`, `Aprovado internamente`, `Enviado`, `Aceito`, `Recusado` e `Cancelado`. Todos continuam reconhecidos no modelo. A criação produz `Em elaboração`; revisão, aprovação, retorno, cancelamento e resultados comerciais estão ativos. `Rascunho` e `Enviado` não ganharam novas ações: o Builder existente emite documentos a partir de `Aprovado internamente`, sem simular envio ao cliente.

O editor técnico permanece no detalhe do ORC. O Builder continua sendo o editor do documento comercial separado, com revisão própria. Sua prévia vem do servidor; a emissão verifica a revisão do ORC, a revisão da proposta e a igualdade do snapshot comercial. Versões emitidas não são sobrescritas. Apenas uma ação explícita cria a próxima versão. Alterações posteriores do ORC não modificam documentos anteriores. Aceite/recusa e respectivos eventos são registrados juntos na transação.

O PDF continua sendo renderizado pelo frontend e salvo pelo mecanismo existente. O banco armazena seu conteúdo comercial imutável e metadados, permitindo nova geração do mesmo documento após recarga. Se o registro da emissão falhar após o download, a tela informa que a emissão não foi registrada e pede descarte/nova tentativa. Não foi criado upload de mídia ou armazenamento de binários.

## Arquivos

Backend novo: `QuoteDtos`, `QuoteMapper`, `QuoteRepository`, `QuoteService`, `ProposalService`, `QuoteResource`, `ProposalResource`; entidades `QuoteEntity`, `QuotePieceEntity`, `QuoteItemEntity`, `QuoteHistoryEntity`, `QuoteProposalEntity`, `QuoteProposalVersionEntity`; `V2__quotes.sql`; testes `QuoteResourceTest`, `QuoteServiceTest` e `DatabaseIsolationResource`.

Backend existente alterado: `RequestResource.java`, apenas para delegar o endpoint de conversão ao serviço de ORC. `RequestService`, `RequestMapper`, `RequestDtos`, `requestService.js`, `requestApi.js` e V1 permanecem inalterados.

Frontend: `quoteApi.js`, `quoteService.js`, `quotePieceService.js`, `proposalService.js`, `useQuote.js`, as quatro páginas auditadas, `QuoteFilters.jsx`, `ProposalConfigPanel.jsx`, consultas em `workService`, `teamService`, `operationalHistoryService` e `MyWorkPage`. Imports de Projeto e Cliente foram direcionados aos serviços explicitamente demo. Testes foram atualizados para distinguir fixtures legadas de rotas reais assíncronas; novos testes de API e navegador cobrem a integração.

## Auditoria final de mocks

| Ocorrência restante | Classificação |
| --- | --- |
| `demoQuoteService.js`: `runtimeQuotes`, geração local, normalização e defaults demo | Legado isolado, usado por Projeto e seus testes; nunca pela lista, detalhe, conversão ou Builder reais |
| `demoProposalService.js`: `Map`, snapshots em memória | Legado isolado para Projeto/Cliente ainda não migrados |
| `data/internal/quotes.js` e `data/internal/requests.js` | Fixtures legadas; o import existente de RequestsPage usa opções de filtro, não os registros como fonte de SOL |
| `projectService.js`, `ProjectDetailPage.jsx`, `customer/customerService.js` | Módulos não migrados; imports explicitamente demo preservam compatibilidade |
| Referências econômicas em `pricingKnowledge`, `pricingService` e padrões de `administrationService` | Configurações dos módulos adiados; ORC captura e persiste os valores adotados, sem recarregar o ORC desses módulos |
| Textos/badges condicionais de demonstração no detalhe | Apresentação legada sem repositório/fallback; API de ORC retorna `source: real` |
| `localStorage` de sessão do portal | Mecanismo pré-existente, fora do escopo; não contém ORCs |
| IDs locais de itens (`ITEM-UUID`) | Identidade dos novos itens de formulário, validada e persistida pelo backend; não são códigos ORC |

As rotas reais não importam os repositórios demo, não geram ORC-XXXX e não usam localStorage como fonte do orçamento. Falhas propagam erro, sem retorno fictício.

## Validação e operação

### Continuação concluída em 23/09/2026

A execução anterior havia concluído a implementação backend/frontend e os testes unitários/API, mas parou na validação de navegador do salvamento da observação comercial. Faltavam a confirmação do reinício e a aplicação de V2 em DEV. O estado existente foi auditado por `git status` e `git diff`; não houve reset, recriação da implementação ou alteração da V1.

Nesta continuação foram alterados apenas `frontend/tests/quoteBrowser.mjs` (foco da página, espera do editor habilitado, diagnóstico de requisições e modo de verificação de registros existentes após reinício) e este relatório. O código funcional já implementado foi preservado. Scripts/logs transitórios de auditoria ficaram em `backend/target`, ignorado pelo Git. As alterações do usuário em `frontend/index.html` e `frontend/public/icon.png` foram preservadas.

Resultados efetivamente executados:

- `mvn -Dlab.browser=true clean test`: **16 testes, zero falhas, zero erros, zero skips; BUILD SUCCESS**. Datasource fixado em `lab_platform_test`. A comparação integral de DEV antes/depois confirmou linhas e sequences inalteradas.
- `npm test`: **52 testes aprovados**, nenhum skip ou falha.
- ESLint somente dos arquivos JavaScript/JSX novos ou alterados: **exit 0**.
- `npm run build`: **exit 0**, build de produção gerado.
- `git diff --check`: **exit 0**.
- Navegador: SOL-0074 → ORC-0028 exclusivamente em TEST; edição, salvamento, F5, lista, vínculo e status na SOL, Builder/salvamento/F5, falha de API sem mocks e retry aprovados.
- Reinício: a suíte encerrou o backend; um novo backend empacotado, novo servidor Vite e novo perfil Chrome recuperaram o escopo e a observação comercial do ORC-0028. **Exit 0**. O modo `LAB_BROWSER_EXISTING_QUOTE` apenas consulta esse registro existente.
- Flyway: **V1 + V2 com sucesso em `lab_platform` e `lab_platform_test`**, com as mesmas oito tabelas ORC. DEV passou de V1 para V2 pela inicialização normal do backend.
- DEV após migração: **duas SOLs, zero ORCs**. Hash dos dados preexistentes permaneceu idêntico; nenhum teste inseriu dados em DEV e não houve limpeza destrutiva.

Backend DEV iniciado em `http://localhost:8080` usando o pacote gerado. O processo auxiliar TEST foi encerrado após as verificações. Não há pendência funcional identificada no escopo ORC. Os módulos adiados e o armazenamento de binários continuam fora deste escopo.

Os comandos e resultados finais ficam registrados na entrega. A suíte backend verifica conversão, formatação dos códigos, vínculos recíprocos, listagem/detalhe, atualização, composição, revisão concorrente, duplicidade simultânea, rollback provocado por trigger apenas em TEST, proposta persistida e bloqueio após aceite.

`DatabaseIsolationResource` fixa a URL de TEST antes do Flyway. Cada teste de integração confirma `DB_NAME()`. A suíte compara um hash de todas as linhas de todas as tabelas e dos valores das sequences em `lab_platform` antes/depois, usando somente SELECT em DEV. O teste de navegador executa o frontend com proxy exclusivo para a API TEST em 8081; jamais usa a API DEV.

O teste de navegador é habilitado por `mvn -Dlab.browser=true clean test` quando Chrome está instalado. Seu fluxo cobre SOL apta → criar ORC na interface → editar/salvar → F5 → lista → vínculo/status na SOL → Builder/salvar/F5 → API indisponível/retry. A suíte normal continua disponível por `mvn clean test` sem dependência obrigatória de Chrome.

Para a validação manual, iniciar backend e frontend normalmente. O Flyway aplica V2 sem apagar SOLs. Usar uma SOL apta, criar ORC, editar e salvar; atualizar ou reiniciar os processos; verificar o ORC e retornar à SOL. Dados persistem no SQL Server.

Próximas missões: Projeto, autenticação, Área do Cliente, notificações, execução, faturamento, conhecimento operacional, catálogo/configurador e persistência dos módulos administrativos. Nenhum deles foi implementado nesta missão.
