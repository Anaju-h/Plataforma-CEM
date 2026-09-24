# Consolidação SOL → ORC → PRJ e Histórico

## Alterações desta missão

| Arquivo | Alteração |
| --- | --- |
| `frontend/src/services/quoteService.js` | `isArchivedQuote` considera `projectId`, além de Recusado/Cancelado. |
| `frontend/src/services/operationalHistoryService.js` | Retorna o PRJ vinculado como próximo registro do ORC. |
| `frontend/src/services/workService.js` | Meu Trabalho usa a mesma classificação de ORC ativo/histórico. |
| `frontend/src/pages/internal/MyWorkPage.jsx` | Indicadores usam a classificação compartilhada, sem modificar o markup. |
| `frontend/src/pages/internal/OperationalHistoryPage.jsx` | O identificador já exibido de destino passa a ser link para ORC/PRJ. Sem mudança de layout. |
| `backend/src/main/java/br/org/senai/lab/exception/UnhandledExceptionMapper.java` | Remove `System.err.println` e `printStackTrace`; mantém `LOG.error` com exceção e resposta HTTP 500 genérica em português correto. |
| `backend/src/main/resources/db/migration/V4__project_status_encoding.sql` | Corrige status legados e recria a constraint, preservando dados e relações. |
| `backend/src/test/java/br/org/senai/lab/ProjectResourceTest.java` | Testa V4 com valores corrompidos, identidade/vínculos, constraint e mensagem genérica; executa a regressão ampliada de navegador. |
| `frontend/tests/operationalLifecycle.test.mjs` | Testa classificação real por respostas da API, histórico das três etapas, Meu Trabalho/Equipe, listas vazias e rede offline. |
| `frontend/tests/projectBrowser.mjs` | Amplia regressão até conclusão do projeto e Histórico, incluindo F5, duplicidade, indisponibilidade e categorias vazias. |
| `frontend/tests/operationalFlow.test.mjs` | A expectativa legada passa a exigir ORC vinculado e PRJ encerrado no Histórico. |

As alterações anteriores do workspace foram preservadas. O diff desta missão foi comparado com uma cópia do frontend feita antes das alterações. Nenhum CSS, card, filtro, tipografia, cor ou espaçamento foi alterado. A única alteração na apresentação foi tornar o identificador relacionado clicável no Histórico.

## Regra operacional

- SOL convertida/encerrada pertence ao Histórico; a regra existente foi preservada.
- ORC com `projectId` persistido pertence ao Histórico, qualquer que seja seu status comercial. Recusado e Cancelado continuam históricos.
- ORC Aceito **sem** PRJ permanece ativo, inclusive em Meu Trabalho e Equipe.
- PRJ Concluído/Cancelado pertence ao Histórico; os demais estados operacionais continuam ativos.

O status comercial Aceito não é modificado pela classificação. A API já retorna `projectId` a partir da relação persistida. O evento `Projeto criado` já era gravado transacionalmente no ORC e foi preservado; a regressão confirma exatamente um evento mesmo após repetir a conversão. O Histórico consulta as três APIs existentes, sem fallback para mocks.

## Encoding e V4

Os 14 arquivos de código/dados diretamente relacionados a PRJ examinados nesta cópia já eram UTF-8 válido, com mensagens corretas. Nenhuma substituição desnecessária foi feita nesses fontes. Leituras explícitas em UTF-8 evitam confundir a decodificação padrão do PowerShell com corrupção do arquivo.

V4 remove `CK_project_status`, converte as sequências legadas de ç, ã e í e a variante `ConcluÃdo`, e recria a constraint com os seis status corretos. `NCHAR` e comparação binária identificam precisamente os caracteres corrompidos, incluindo o hífen invisível da sequência de í. Valores corretos são preservados. Não há exclusão de registros, reset de sequence ou mudança de IDs/vínculos.

V1, V2 e V3 foram verificadas por hash contra o início da missão e permanecem intactas. O teste da V4 introduz valores corrompidos somente em `lab_platform_test`, executa o SQL da migration e verifica recuperação, identidade e constraint validada; toda essa preparação é revertida por rollback.

## Validação

- Backend: **BUILD SUCCESS**, 23 testes, zero falhas, zero erros, um skip. O skip é o teste opcional preexistente de navegador de ORC. Os seis testes de integração PRJ, incluindo a V4 e o navegador ampliado, passaram.
- Frontend: **62 testes aprovados**, zero falhas ou skips; resultado final no log `frontend/lifecycle-tests.log`.
- Lint dos arquivos alterados aprovado.
- Build Vite aprovado; permanece o aviso preexistente de chunks maiores que 500 kB.
- Isolamento: `DatabaseIsolationResource` confirmou todas as linhas e sequences de `lab_platform` inalteradas. Testes e Flyway usaram exclusivamente `lab_platform_test`. Nenhum `.env` ou credencial foi alterado.

A suíte Maven usou um POM temporário idêntico ao original, mudando apenas a saída para `target/lifecycle-check`, e porta 8097 para preservar processos existentes:

```text
mvn -B -f pom-lifecycle-check.xml -Dquarkus.http.test-port=8097 -Dlab.project.browser=true clean test
```

O POM temporário foi removido após a validação. Para executar normalmente, use `mvn -Dlab.project.browser=true clean test`, com Java 21; a porta alternativa pode ser informada se 8081 estiver ocupada.

## Fluxo completo

A regressão criou e analisou **SOL-0120**, converteu para **ORC-0058**, editou/salvou, gerou e aceitou a proposta pela API de teste. O navegador verificou SOL no Histórico, ORC aceito ainda ativo e proposta no Builder; criou **PRJ-0011** pela ação existente; salvou observações, checklist e transições até **Concluído**.

Foram confirmados ORC fora da lista ativa após criar PRJ, ORC no Histórico com link para o projeto, conclusão e retirada do PRJ da lista ativa, Histórico das três etapas, persistência após F5, conversão repetida retornando o mesmo PRJ e ausência de duplicação do evento comercial. Também passaram os cenários de API offline/retry, Meu Trabalho e listas vazias. As respostas vazias são interceptadas apenas no teste de navegador; nenhum mock foi adicionado à aplicação.

Evidências locais: `backend/target-lifecycle-test.log`, `backend/target/lifecycle-check/surefire-reports`, `backend/target/project-browser/project-browser.log` e `backend/target/project-browser/operational-history-complete.png`.

## Pendência de ativação em DEV

Recompilar/reiniciar o backend com o código atualizado para o Flyway aplicar V4 em DEV. A migration não foi executada em DEV durante os testes. Não há pendência funcional identificada na regressão nem alterações em funcionalidades fora desta missão.
