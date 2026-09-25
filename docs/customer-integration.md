# Área do cliente no fluxo SOL → ORC → PRJ

## Modelo e limites

V5 adiciona `customer_company` e `customer_user`, com UUID, contato, timestamps e usuário ativo, sem senha. `lab_request` recebe `customer_company_id` e `customer_user_id`. A FK composta impede vincular um usuário à empresa errada. V1–V4 permanecem intactas. ORC e PRJ obtêm a propriedade por suas relações existentes até a SOL.

A criação do cliente chama `RequestService.createForCustomer`, que reutiliza a criação canônica, substitui os dados de contato pelo cadastro persistido e grava `Cliente` / `Área do cliente`. A API interna não permite declarar essa origem sem contexto. A sequência do SQL Server continua gerando o código SOL. O payload do formulário é compartilhado com o fluxo interno/público.

`CustomerContext` é a fronteira de identidade. `TemporaryCustomerContext` seleciona um usuário persistido por configuração do servidor, somente no modo DEV/teste. Não recebe identidade por email, query string, cabeçalho ou armazenamento do navegador. Em execução normal/produção, retorna 503 mesmo se houver um UUID configurado. Esse mecanismo não autentica pessoas: todos que acessarem a instância DEV usam o mesmo cliente configurado.

Todas as consultas de cliente filtram **empresa e usuário** no banco, inclusive buscas diretas e respostas a propostas. Outro usuário, inclusive da mesma empresa, recebe 404 ao tentar acessar um atendimento alheio. As respostas usam listas explícitas de campos comerciais/públicos; entidades, análises, custos, tarefas e históricos internos não são serializados.

## API

| Método | Endpoint | Comportamento |
| --- | --- | --- |
| GET | `/api/customer/context` | Cadastro do cliente selecionado |
| GET / POST | `/api/customer/requests` | Consultar/criar SOL canônica |
| GET | `/api/customer/requests/{SOL}` | Detalhe e vínculos da jornada |
| GET | `/api/customer/quotes` | ORCs do cliente e versões comerciais |
| GET | `/api/customer/quotes/{ORC}` | Mesmo DTO comercial filtrado |
| POST | `/api/customer/quotes/{ORC}/proposal/versions/{n}/result` | Aceitar ou recusar a versão apresentada |
| GET | `/api/customer/projects` | PRJs do cliente |
| GET | `/api/customer/projects/{PRJ}` | Status, prazo e progresso público |

O resultado reutiliza `ProposalService.resultAs`, mantendo validação de revisão, versão vigente, estado do ORC e snapshot. O autor é identificado pelo UUID do cliente, e a data é definida pelo servidor. O fluxo interno continua utilizando o mesmo mecanismo com o autor interno. Aceitar não cria PRJ automaticamente.

No domínio atual, gerar a versão é a emissão/publicação da proposta; não existe um estado separado de envio. Somente snapshots dessas versões são expostos. Rascunhos, metadados PDF arbitrários e observações internas do resultado ficam fora da resposta. Versões substituídas permanecem consultáveis, mas não aceitam resposta.

A jornada mostra os registros e datas reais SOL → ORC → PRJ e a conclusão. Não replica nem publica `request_history`, `quote_history` ou `project_history`. Os nomes dos estados do PRJ são traduzidos somente na resposta do cliente. A política Serviço × Equipamento e o checklist continuam no domínio existente.

## Telas

`/cliente` encaminha ao dashboard real, sem formulário de senha fictício. Layout, sidebar, topbar e formulário visual foram preservados. Dashboard, nova solicitação, listagem/detalhe de solicitações, orçamentos/propostas e projetos usam o backend. O contexto do layout também alimenta os dados exibidos na conta; os controles antigos de edição, código por email e segurança ficam desabilitados no contexto temporário, com indicação de somente leitura. Loading, vazio, erro/retry e confirmação de criação/resposta são explícitos. As versões podem ser abertas e baixadas com o renderer comercial existente. Datas são apresentadas em português no fuso de São Paulo.

Foram removidos os clientes, SOLs, PRJs e propostas demo do serviço e o cliente mock do layout. Documentos não têm backend; a rota permanece sem documentos fictícios. Cadastro/edição de conta, documentos avançados e mensagens não foram integrados nesta missão. Não havia ação de repetir solicitação no portal existente; não foi introduzida.

## Usar em DEV sem alterar `.env`

1. Inicie o backend com `mvn quarkus:dev`, permitindo ao Flyway aplicar V5 sem resetar o banco.
2. Se ainda não existir cadastro de cliente, execute explicitamente `backend/scripts/create-dev-customer.sql` no banco **DEV `lab_platform`**. O script cria apenas empresa/usuário, não SOL/ORC/PRJ, e retorna o UUID. Não é seed automático nem migration.
3. No processo do backend, configure `LAB_CUSTOMER_DEMO_USER_ID=<UUID retornado>` como variável de ambiente, ou inicie com `mvn quarkus:dev -Dlab.customer.demo-user-id=<UUID>`.
4. Abra `/cliente`. Para demonstrar outro cliente, altere a configuração do servidor e reinicie. Nenhum seletor de identidade é exposto ao navegador.

Os testes não executam esse provisionamento DEV. Criam seus próprios cadastros exclusivamente em `lab_platform_test`. `DatabaseIsolationResource` fixa o datasource antes de Flyway e compara todas as linhas/sequências de DEV antes e depois.

## Validação

Com Java 21 e Maven disponíveis:

```powershell
cd backend
mvn -B -Dquarkus.http.test-port=8097 -Dlab.customer.browser=true -Dlab.project.browser=true -Dlab.browser=true test
cd ../frontend
yarn test
yarn build
```

Os testes de navegador exigem Chrome e usam perfis temporários exclusivos. O teste do cliente cria Treinamento pela interface, verifica proposta/aceite, acompanha execução e conclusão, recarrega páginas e testa API offline/retry. Operações internas dessa jornada são realizadas pela API canônica; os testes de navegador internos existentes validam as respectivas telas.

Resultados em 24/09/2026:

- Suíte completa backend com os três testes de navegador habilitados: **29 testes, zero falhas/erros/skips**. Inclui regressão SOL/ORC/PRJ e da política de equipamentos.
- Verificação final após os últimos ajustes: **6 testes de cliente/SOL, zero falhas/erros/skips**, incluindo novo teste de origem forjada/usuário inativo e jornada Chrome com conta somente leitura. Atendimento dessa execução: `SOL-0237 → ORC-0144 → PRJ-0041`, concluído no banco de teste.
- Frontend: **68 testes aprovados** na suíte completa, mais **1 novo teste de notificações internas aprovado**. Após o ajuste final do canal, os **8 testes de APIs cliente/SOL** foram reexecutados e aprovados.
- Lint de todos os arquivos JS/JSX alterados: **sem erros**. Lint global: **8 erros preexistentes**, preservados fora do escopo.
- Build frontend: **aprovado**; permanece o aviso de chunks acima de 500 kB.
- Jornada Chrome: criação de Treinamento sem equipamento pela UI, SOL canônica, proposta emitida, aceite pela UI, PRJ e conclusão; F5 nas etapas, sem identidade em localStorage/sessionStorage, sem vazamento de resumo técnico, offline/retry. A regressão interna do navegador também passou por ORC/Builder/PRJ/Histórico/Meu Trabalho e cenários vazios/offline.
- Isolamento: Cliente B não lista, abre nem responde registros de A; também verificado para outro usuário da mesma empresa. Contato enviado pelo navegador não substitui a identidade persistida. Recusa impede criação de PRJ; serviço REQUIRED sem equipamento bloqueia a revisão conforme o domínio existente.
- DEV: comparação integral de linhas e sequências confirmou **nenhuma alteração pelos testes**. `.env` e V1–V4 não foram alterados. V5 foi aplicada e validada em `lab_platform_test`; sua aplicação em DEV ocorre no próximo início do backend atualizado.

Evidências locais (ignoradas pelo Git): `backend/target/customer-verification.log`, `backend/target/customer-final-check.log`, `backend/target/customer-browser/`, `backend/target/project-browser/`, `frontend/customer-tests.log` e `frontend/customer-lint-global.log`.

## Autenticação futura

Substituir `TemporaryCustomerContext` por identidade autenticada resolvida no servidor, definir a política de compartilhamento entre usuários da empresa e proteger também as APIs internas existentes. Não há JWT, OIDC, senha, pagamento ou Gestão do Conhecimento nesta entrega. A instância DEV e suas APIs internas continuam sendo um ambiente de desenvolvimento, não uma implantação segura para acesso externo.

## Arquivos

- Backend: entidades `CustomerCompanyEntity`, `CustomerUserEntity`, vínculo em `RequestEntity`, mapper da SOL, `CustomerContext`, `TemporaryCustomerContext`, `CustomerService`, `CustomerResource`, reutilização em `RequestService` e `ProposalService`.
- Banco: `V5__customers.sql` e script opcional `scripts/create-dev-customer.sql`.
- Frontend: `customerService.js`, extração do payload em `requestApi.js`, hook `useCustomerData`, utilitário `customerDate`, `CustomerApiState`, `CustomerPortalLayout`, rotas e páginas Account, Dashboard, NewRequest, Requests, RequestDetail, Quotes e Projects.
- Testes: `CustomerResourceTest`, `TestCustomerContext`, `customerApi.test.mjs`, `customerBrowser.mjs`, `customerNotificationRegression.test.mjs` e atualização das expectativas demo em `proposal.test.mjs` e `quoteItems.test.mjs`.
