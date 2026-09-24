# Integração de Projetos — missão PRJ

O fluxo implementado é SOL → ORC → proposta aceita → criação transacional de PRJ → listagem/detalhe/atualização persistidos. O estado dos arquivos no início da missão, incluindo alterações anteriores não commitadas, foi a referência da auditoria visual.

1. **Estrutura encontrada.** `ProjectsPage.jsx` já tinha busca, filtro de status, cards e progresso; `ProjectDetailPage.jsx` já tinha informações, checklist, observações, histórico, ações de execução, origem comercial, rastreabilidade e confirmação de conclusão/reabertura. Rotas existentes: `/portal/projetos` e `/portal/projetos/:projectId`. Não havia editor de documentos próprio de PRJ; a proposta continuava no ORC/Builder.

2. **Mocks encontrados.** `data/internal/projects.js` e o antigo `projectService.js` mantinham projetos em memória, geravam códigos localmente e consultavam `demoQuoteService`/`demoProposalService`. Meu trabalho, Equipe, Histórico e a área cliente também consumiam esse serviço.

3. **Modelagem.** `ProjectEntity` possui UUID técnico, código operacional, ORC, proposta aceita, versão aceita, responsável, prioridade, status, descrição, observações, prazo, criação, atualização, conclusão e revisão. Checklist e histórico possuem entidades próprias. SOL, empresa, serviço e equipamento são obtidos pela relação com ORC, sem copiar novamente seus cadastros. O vínculo com a versão aponta para o documento comercial imutável já existente; não cria outra estrutura de proposta. Não foi introduzido JSON no modelo de PRJ.

4. **Migration.** `V3__projects.sql`, aditiva. V1 e V2 foram preservadas. `project_code_seq` é SQL Server `BIGINT START WITH 1 INCREMENT BY 1`; `NEXT VALUE FOR` aloca números atomicamente. Formatação mínima de quatro dígitos, sem truncamento acima de 9999. Rollback pode deixar lacunas, como é normal em sequences.

5. **Tabelas.** `lab_project`, `project_task`, `project_history`. Chaves compostas adicionais nas tabelas de proposta garantem que a versão vinculada pertence à proposta e ao ORC corretos. `quote_id` e `project_code` são únicos. Não há limpeza, reset de sequence nem exclusão de SOL/ORC na migration.

6. **Endpoints.** `GET /api/projects`, `GET /api/projects/{id}`, `POST /api/quotes/{quoteId}/project`, `PUT /api/projects/{id}`. Projeto aceita código operacional ou UUID na consulta/atualização; ORC segue seu identificador operacional existente. POST sem corpo retorna o projeto criado ou o já existente. PUT recebe `revision`, `operation` e somente os dados da operação: `notes` (`internalNotes`), `task` (`taskId`, `completed`), `prepare`, `start`, `review`, `return`, `complete`, `reopen`. Não há criação avulsa nem alteração arbitrária de vínculos/histórico.

7. **Arquivos backend desta missão.** Sob `backend/src/main/java/br/org/senai/lab/`: novos `entity/ProjectEntity.java`, `entity/ProjectTaskEntity.java`, `entity/ProjectHistoryEntity.java`, `dto/ProjectDtos.java`, `mapper/ProjectMapper.java`, `repository/ProjectRepository.java`, `service/ProjectService.java`, `resource/ProjectResource.java`. Alterados `resource/QuoteResource.java` para a conversão e `service/QuoteService.java` para retornar `projectId`/`convertedToProject`. Nova migration em `src/main/resources/db/migration/V3__projects.sql`. Novos testes `src/test/java/br/org/senai/lab/ProjectResourceTest.java` e `service/ProjectServiceTest.java`.

8. **Arquivos frontend desta missão.** Sob `frontend/src/`: novos `services/projectApi.js` e `services/demoProjectService.js`; adaptados `services/projectService.js`, `services/workService.js`, `services/teamService.js`, `services/customer/customerService.js`, `pages/internal/ProjectsPage.jsx`, `ProjectDetailPage.jsx`, `QuoteDetailPage.jsx`, `MyWorkPage.jsx`. Remoção de indicadores técnicos em `pages/internal/QuotesPage.jsx`, `RequestDetailPage.jsx`, `OperationalHistoryPage.jsx`, `TeamPage.jsx`, `KnowledgePage.jsx`, `KnowledgeDetailPage.jsx`, `EquipmentCostsPage.jsx`, `components/internal/QuoteItemsEditor.jsx`, `CommercialRateSettings.jsx`. Testes novos: `tests/projectApi.test.mjs`, `tests/projectBrowser.mjs`; ajustados `operationalFlow.test.mjs`, `proposal.test.mjs`, `quoteItems.test.mjs` para o serviço explicitamente demonstrativo e `internalExperience.test.mjs` para a remoção solicitada do badge.

9. **ORC aceito → PRJ.** A ação usa `projectService → projectApi → Quarkus → SQL Server`. O backend bloqueia o ORC, verifica vínculo existente e aceite, cria projeto/checklist/histórico e registra o vínculo no histórico comercial, tudo na mesma transação. O frontend navega apenas após a resposta. O vínculo operacional não altera a revisão comercial nem invalida o documento aceito.

10. **Sem aceite não cria.** Exige ORC `Aceito`, proposta vinculada, número de versão aceita e versão com `status=accepted`, `resultType=accepted` e registro do resultado. Falhas retornam 409. A interface também exige a versão aceita e bloqueada pelo contrato existente, mas a garantia é do backend.

11. **Duplicidade.** Bloqueio pessimista do ORC serializa as conversões concorrentes. A consulta de vínculo retorna o mesmo projeto em repetição. A restrição única de `lab_project.quote_id` reforça a garantia no banco. Atualizações usam revisão e bloqueio pessimista; revisão antiga retorna 409.

12. **Rastreabilidade.** PRJ → ORC → SOL e PRJ → proposta → versão aceita são relações persistidas. A resposta mantém códigos para apresentação e UUIDs técnicos separados. Ao reabrir o ORC, `projectId` vem do banco e a ação passa a ser `Abrir projeto PRJ-XXXX`.

13. **Páginas usando API.** Lista e detalhe de Projetos, conversão no detalhe de ORC e consultas de PRJ em Meu trabalho, Equipe e Histórico. Loading/erro/retry reutilizam `ApiState`. Falha de rede não retorna mock, cache local ou sucesso fictício. Observações, checklist e estados existentes permanecem após F5.

14. **Mocks restantes.** Fixtures e serviços demonstrativos foram mantidos para a área cliente ainda não migrada e testes legados isolados. A área cliente importa explicitamente `demoProjectService`, sem receber a resposta interna completa da API. Nenhuma rota interna migrada usa esse serviço. A geração local legada existe somente nesse módulo demonstrativo; o fluxo real recebe UUID/código exclusivamente do backend.

15. **Validação backend.** **BUILD SUCCESS: 22 testes, zero falhas, zero erros, um skip** (teste de navegador preexistente de ORC, opt-in separado). O navegador de PRJ foi executado e passou. A suíte cobre criação, formato PRJ, vínculos, ausência de aceite, conversão concorrente, listagem, detalhe por código/UUID, observações, checklist, revisão obsoleta, transições existentes, bloqueio de conclusão com pendências, reabertura e rollback provocado no banco.

16. **Validação frontend.** **59 testes aprovados, zero falhas ou skips**, via `node --test tests/*.test.mjs`. Testes de serviço e renderização cobrem visibilidade da ação, criação pela API, ausência de aceite, abertura do existente sem POST, lista/detalhe, rede offline, conflitos e espera da resposta. O teste Chrome percorreu ORC aceito → **PRJ-0001** na primeira execução → observações/checklist → F5 → mudança de status/F5 → listagem → ORC vinculado → abrir existente; também validou erros/retry de lista e detalhe e ausência de exceções JavaScript. A repetição final criou PRJ-0005 sem reiniciar a sequence.

17. **Lint.** Aprovado, sem erros ou avisos. Executado somente nos arquivos JavaScript/JSX alterados e testes da missão.

18. **Build.** Vite gerou o bundle de produção. Permanece o aviso de chunks acima de 500 kB, inclusive o renderer PDF já utilizado pelo projeto; não foi feita refatoração de bundle fora do escopo.

19. **DEV/TEST.** A suíte usa `DatabaseIsolationResource`, que fixa a conexão em `lab_platform_test` antes do Flyway. Cada teste de integração verifica `DB_NAME()`; testes com trigger repetem a verificação na conexão de DDL. O recurso compara todas as linhas e sequences de `lab_platform` antes/depois por consultas de leitura. Nenhum mock/teste é inserido em DEV. A execução normal do backend aplicará V3 em DEV na próxima inicialização com este código.

20. **Auditoria visual.** Revisados os diffs Git contra a cópia de `frontend/src` feita antes das alterações, para separar mudanças desta missão de alterações anteriores. Lista preserva todo o markup de filtros/cards. Detalhe preserva seções, classes, controles, textos e confirmações; mudanças são carregamento/handlers assíncronos e bloqueio durante gravação. ORC só recebe a ação de PRJ e remoção dos indicadores solicitados. Demais páginas têm apenas adaptação de consulta ou retirada da classificação técnica. CSS, tipografia, cores, espaçamentos, componentes de status e Proposal Builder não foram alterados nesta missão. Capturas da lista, detalhe e ORC aceito foram inspecionadas. Não houve redesign.

21. **Indicadores removidos.** `Real` da lista de ORC, `Base real` do detalhe e Histórico, badges `Demonstração`/`Referência demo` e textos de classificação técnica equivalentes. Status comerciais e operacionais continuam nos componentes existentes. `source`, `isDemoCompatibility` e separação interna de dados permanecem. Avisos funcionais de limitações ainda existentes, como configurações não persistidas e autenticação demonstrativa, não foram convertidos em afirmações de persistência/autenticação real.

## Execução e evidências

O `mvn clean test` inicial encontrou `backend/target/quarkus-app/quarkus-run.jar` bloqueado pelo Windows. A porta de teste padrão 8081 também já estava ocupada. Para preservar os processos existentes, foi usado um POM temporário idêntico ao original, alterando somente o diretório de build para `target-prj-check`, e a porta de testes 8097:

```powershell
mvn -B -f pom-prj-check.xml -Dquarkus.http.test-port=8097 -Dlab.project.browser=true clean test
```

Java 21 e repositório Maven local foram informados por caminhos do ambiente. A opção `lab.project.browser` habilita o Chrome headless exclusivamente no datasource protegido de teste. Para rodar com o POM normal após liberar `target`, use `mvn -Dlab.project.browser=true clean test`; a porta alternativa é opcional quando 8081 estiver livre.

Para validar manualmente em DEV, reinicie o backend com o código atualizado, abra um ORC com proposta aceita, crie o PRJ e repita lista → detalhe → F5 → ORC vinculado. Não é preciso gerar nenhum registro de teste em DEV para aplicar a migration. Não houve avanço para autenticação, planner, notificações, faturamento ou outros módulos.

Evidências locais: `backend/target-project-test.log`, `backend/target/prj-check/surefire-reports`, `backend/target/prj-check/project-browser.log` e capturas `prj-accepted-quote.png`, `prj-detail.png`, `prj-list.png` nesse mesmo diretório. Frontend: `project-tests.log`, `project-lint.log`, `project-build.log`. Ao terminar, o POM temporário foi removido e os artefatos do build isolado foram movidos para dentro de `backend/target`, já ignorado pelo Git. Execuções futuras do navegador usam `backend/target/project-browser` por padrão.
