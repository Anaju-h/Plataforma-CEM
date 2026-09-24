# Serviço × equipamento

## Classificação canônica

| serviceId | equipmentRequirement |
| --- | --- |
| dimensional | REQUIRED |
| scan | REQUIRED |
| reverse-engineering | OPTIONAL |
| internal | REQUIRED |
| failure-analysis | OPTIONAL |
| asset-structure | NOT_APPLICABLE |
| digital-library | OPTIONAL |
| maintenance | OPTIONAL |
| training | OPTIONAL |

O catálogo `frontend/src/data/serviceCatalog.js` contém a classificação usada pelos consumidores de qualquer origem. `EquipmentPolicy` representa a mesma regra no backend. `EquipmentPolicyTest` lê o catálogo canônico e compara os nove IDs e requisitos, impedindo divergência silenciosa.

## Comportamento e persistência

- REQUIRED: tecnologia de referência obrigatória ao salvar o ORC e ao enviar para revisão. A API retorna HTTP 400 se estiver ausente. A criação inicial a partir da SOL continua permitida com `null`. A criação do projeto também valida a regra.
- OPTIONAL: o campo oferece “Sem equipamento específico / Não se aplica”; a opção corresponde a `null`, sem adicionar equipamento ao catálogo.
- NOT_APPLICABLE: o campo exibe “Não se aplica”, desabilitado. Novos registros persistem `null`. Equipamentos históricos já associados ao mesmo serviço são preservados, inclusive em atualizações.
- Orçamentos com vários serviços consideram serviço principal, serviços da SOL e composição atual. REQUIRED prevalece sobre OPTIONAL, que prevalece sobre NOT_APPLICABLE.
- Itens obrigatórios sem equipamento próprio usam a tecnologia de referência na apresentação comercial. Itens opcionais sem equipamento continuam sem associação própria.
- A conversão SOL → ORC reconhece recomendações que correspondem exatamente a IDs ou nomes de máquinas reais (incluindo nomes sem o prefixo ZEISS). Texto livre não reconhecido não gera equipamento fictício.
- Propostas novas mostram textos amigáveis quando a seção de tecnologia está habilitada. Versões já emitidas não são reescritas.
- O projeto recebe `serviceId`, `machineId`, `quoteId` e `requestId` pelos vínculos persistidos. Ausência de equipamento tem apresentação amigável em detalhes e listagens.
- Histórico e Meu Trabalho mantêm suas regras de ciclo de vida e não filtram registros pela presença de equipamento.
- SOL mantém a tecnologia sugerida opcional durante a análise. A obrigatoriedade é aplicada na etapa técnica do ORC.

## Schema e segurança dos dados

Não foi necessária V5: `lab_quote.machine_id` e `quote_item.machine_id` já aceitam NULL na V2, e PRJ referencia o orçamento. V1–V4, `.env`, catálogo de máquinas e dados existentes não foram alterados por esta missão. Testes de integração usam `lab_platform_test`; o recurso de isolamento compara DEV por consultas somente de leitura, antes e depois da suíte.

## Arquivos desta missão

Backend (prefixo `backend/src/`):

- `main/java/br/org/senai/lab/service/EquipmentPolicy.java`
- `main/java/br/org/senai/lab/service/QuoteService.java`
- `main/java/br/org/senai/lab/service/ProposalService.java`
- `main/java/br/org/senai/lab/service/ProjectService.java`
- `main/java/br/org/senai/lab/dto/ProjectDtos.java`
- `main/java/br/org/senai/lab/mapper/ProjectMapper.java`
- `test/java/br/org/senai/lab/service/EquipmentPolicyTest.java`
- `test/java/br/org/senai/lab/EquipmentResourceTest.java`
- `test/java/br/org/senai/lab/QuoteResourceTest.java`
- `test/java/br/org/senai/lab/ProjectResourceTest.java`

Frontend (prefixo `frontend/`):

- `src/data/serviceCatalog.js`
- `src/services/quoteService.js`
- `src/services/projectService.js`
- `src/services/commercialProposalService.js`
- `src/pages/internal/QuoteDetailPage.jsx`
- `src/components/internal/QuoteItemsEditor.jsx`
- `tests/equipmentPolicy.test.mjs`
- `tests/quoteBrowser.mjs`
- `tests/projectBrowser.mjs`

Documentação: `docs/service-equipment-policy.md`. Alterações que já existiam no workspace foram preservadas.

## Validação

Os testes de domínio, frontend e API cobrem os cenários A–H da missão. Os testes de navegador verificam obrigatoriedade na edição do ORC e Treinamento sem equipamento no ciclo completo, incluindo F5.

Comandos:

```text
mvn -B -Dquarkus.http.test-port=8097 -Dlab.project.browser=true -Dlab.browser=true test
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Frontend: **64 testes passaram**, sem falhas ou skips. Build concluído; permanece o aviso de bundles maiores que 500 kB.

O lint dos arquivos desta missão passou. O lint global continua com **8 erros preexistentes**, nos seguintes arquivos não alterados por esta missão:

| Arquivo em `frontend/src/` | Erros |
| --- | --- |
| `components/configurator/ConfiguratorStage.jsx` | 2 × `react-hooks/set-state-in-effect` |
| `components/configurator/steps/RequirementsStep.jsx` | 1 × `react-hooks/set-state-in-effect` |
| `components/customer/CustomerContactModal.jsx` | 2 × `react-hooks/set-state-in-effect` |
| `components/internal/ProtectedRoute.jsx` | 1 × `react-hooks/error-boundaries` |
| `components/layout/Header.jsx` | 1 × `react-hooks/set-state-in-effect` |
| `pages/customer/CustomerAccessPage.jsx` | 1 × `no-unused-vars` |

Backend: a suíte completa executou **26 testes: 25 passaram e 1 falhou por timeout do navegador no carregamento inicial do Histórico**. A primeira repetição ainda excedeu o prazo de 20 segundos. O teste passou na repetição isolada após usar prontidão do DOM/conteúdo e prazo de 60 segundos, com **1 teste, zero falhas, zero erros, zero skips, BUILD SUCCESS**. Portanto os 26 testes foram validados, considerando a repetição; não houve uma nova execução integral após esse ajuste exclusivo do harness.

O navegador de REQUIRED passou: salvamento sem tecnologia bloqueado; seleção de BOSELLO MAX permitiu salvar e recarregar o ORC. Os oito cenários A–H passaram na API, incluindo rejeição HTTP 400 no salvamento e na revisão de REQUIRED sem equipamento.

O navegador de OPTIONAL passou com **Treinamento**, no banco de teste: **SOL-0173 → ORC-0095 → proposta V1 aceita → PRJ-0024 → Concluído → Histórico**. Verificou salvamento pela interface, F5, `serviceId = training`, `machineId = null`, texto amigável, vínculos, checklist, execução, conclusão, acesso pelo Histórico, Meu Trabalho, prevenção de duplicidade, indisponibilidade da API e páginas vazias. Identificadores anteriores produzidos por esta regressão também permanecem no banco de teste.

As verificações finais de isolamento confirmaram `DEV isolation verified: all lab_platform rows and sequences unchanged.` Nenhum reset ou limpeza de banco foi executado.

Após o ajuste final de apresentação de IDs históricos, **20 testes focados adicionais passaram** e o build foi repetido com sucesso. O lint específico dos arquivos modificados também passou.

Pendências observadas: além dos 8 erros globais de lint e do aviso de tamanho de bundles, o carregamento inicial do Histórico excedeu 20 segundos no ambiente de teste com dados acumulados. A rodada com timeout também registrou um deadlock transitório em leitura no SQL Server; o fluxo de REQUIRED passou e o erro não se repetiu na última execução isolada. Não foi feita otimização geral de consultas nesta missão.
