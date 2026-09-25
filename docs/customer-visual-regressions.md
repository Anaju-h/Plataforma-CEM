# Correções visuais da Área do Cliente — 24/09/2026

## Entrada restaurada

`/cliente` volta a renderizar `CustomerAccessPage` no `CustomerLayout`, com o cabeçalho público. O layout aprovado foi consultado em `78808a4` (`git show HEAD:frontend/src/pages/customer/CustomerAccessPage.jsx`): fundo, duas colunas, tipografia, benefícios, card translúcido e ícones foram reaproveitados.

O card agora oferece **Acessar área do cliente**, um link para `/cliente/dashboard`. Foi removida a simulação de envio/validação de código. Não há senha, formulário de credenciais, identidade fixa no frontend ou autenticação em armazenamento do navegador. A página informa que a entrada usa o contexto DEV do servidor. Cadastro/autenticação continuam futuros.

Os dois botões públicos, desktop e mobile, já apontavam para `/cliente` e foram preservados. A regressão vinha do redirecionamento dessa rota, não dos botões.

## SOL, ORC e PRJ

`frontend/src/components/customer/CustomerListLayout.jsx` centraliza:

- identificação da empresa, título, descrição, alinhamento e espaço da ação principal;
- `CustomerListPanel`: card branco, borda, sombra discreta, raio de 14 px, altura mínima de 300 px e cabeçalho de colunas;
- `CustomerEmptyState`: ícone discreto, título e explicação centralizados dentro do card;
- `CustomerListRow` e `CustomerStatus`: linhas, espaçamentos, quebra de texto e badges consistentes.

Loading, erro e retry permanecem dentro do mesmo card. No mobile, as linhas se reorganizam verticalmente e os botões podem quebrar linha. Orçamentos não aplica mais `.proposal-workspace` à página inteira; o CSS comercial fica restrito à proposta selecionada. Preview, PDF, aceite, recusa e nota continuam com os mesmos serviços e DTOs.

Vazios apresentados:

| Tela | Título | Explicação |
| --- | --- | --- |
| Solicitações | Nenhuma solicitação por enquanto. | Envie sua primeira solicitação para acompanhar o atendimento do laboratório por aqui. |
| Orçamentos | Nenhum orçamento disponível por enquanto. | Quando o laboratório disponibilizar uma proposta, ela aparecerá aqui. |
| Projetos | Nenhum projeto em andamento por enquanto. | Quando o laboratório iniciar um projeto aprovado, você poderá acompanhar as etapas aqui. |

Foi corrigida também a renderização do link da SOL: ele havia sido colocado acidentalmente no atributo `key`, em vez de no código visível. O código agora abre o detalhe existente. Projetos oferece acesso à jornada já existente; nenhum endpoint ou fluxo de negócio novo foi criado.

## Encoding: diagnóstico e prevenção

Leitura **sem escrita** de `GET http://localhost:8080/api/customer/context` encontrou:

- empresa `758914b0-be87-44c1-8b5c-cac23a4399cf`: `Empresa demonstra????o DEV`;
- usuário `ee570f9d-c903-4de7-8826-d610f3dafd0b`: `Cliente demonstra????o`, email `cliente@example.test`;
- cidade: `Goi??nia`.

Os quatro caracteres do nome são efetivamente `U+003F`, não um problema de fonte ou exibição do React. O script original está em UTF-8 e já usava literais `N'...'`, e a API apenas devolve o cadastro. A perda ocorreu na carga dos textos, antes de sua exibição. O padrão é compatível com leitura/envio através de uma página de códigos incompatível (por exemplo, pipeline de shell); o comando original de provisionamento não está disponível para afirmar qual etapa exata fez a conversão. O prefixo `N` não recupera caracteres que chegaram ao SQL Server como `?`.

`backend/scripts/create-dev-customer.sql` agora constrói `ç`, `ã` e `â` com `NCHAR(231)`, `NCHAR(227)` e `NCHAR(226)`. O arquivo utiliza apenas caracteres ASCII, que também constituem UTF-8 válido, evitando perda nessas conversões externas. Mantém a guarda de banco DEV e não introduz seed ou migration.

## Correção específica do cadastro existente

**O reparo abaixo foi fornecido, mas não executado em DEV.** Os nomes já persistidos continuam corrompidos até sua execução. Não foi feito mascaramento no frontend.

Abra uma conexão SQL explicitamente com `lab_platform` e execute o conteúdo de [`repair-dev-customer-encoding.sql`](../backend/scripts/repair-dev-customer-encoding.sql). O comando integral é reproduzido abaixo. Ele verifica banco, UUIDs, vínculo usuário/empresa, email e valores anteriores; usa transação com bloqueio e rollback em erro. Altera somente nome/cidade/timestamp do cadastro identificado. Não apaga nem recria registros, não altera IDs, SOL/ORC/PRJ ou migrations. Reexecutar após o reparo não altera novamente os timestamps.

Depois, recarregue o portal. Topbar, sidebar, dashboard, cabeçalhos de solicitações/orçamentos/projetos e conta recebem os nomes desse mesmo contexto; exibirão `Cliente demonstração` e `Empresa demonstração DEV`. A correção não depende de mudança nos componentes dessas telas.

## Validação e evidências

- Frontend: **69 testes existentes aprovados** e **2 novos testes de apresentação aprovados**.
- Lint dos seis arquivos JSX alterados: **zero erros**.
- Build frontend: **aprovado**, com o aviso já existente de chunks grandes.
- Backend: **4 testes existentes do cliente aprovados**, incluindo isolamento A × B e a jornada real no Chrome.
- Navegador: entrada visual `/cliente`, dashboard, vazios SOL/ORC/PRJ em 1440 px e 390 px, criação real de Treinamento, proposta/aceite, PRJ/conclusão, F5 e offline/retry.
- `DatabaseIsolationResource` confirmou que as linhas e sequências de DEV permaneceram inalteradas.

Capturas locais geradas pelo teste ficam em `backend/target/customer-browser/`: `customer-access.png`, `customer-solicitacoes-empty.png`, `customer-orcamentos-empty.png`, `customer-projetos-empty.png` e suas variantes mobile. Logs: `frontend/customer-visual-tests.log`, `backend/target/customer-visual-verification.log` e `backend/target/customer-visual-browser-final.log`.

## Escopo preservado

Nesta correção não houve alterações em APIs, DTOs, serviços de integração, contexto temporário, domínio SOL → ORC → PRJ ou V1–V5. Sidebar, topbar, logos, dashboard, conta e área interna não foram modificados. Os únicos arquivos backend alterados/adicionados nesta missão são os scripts de provisionamento e reparo de texto.

## Comando SQL de reparo

```sql
-- Manual repair for the exact DEV records inspected on 2026-09-24.
-- No inserts, deletes, ID changes, migrations, or business-record changes.
-- ASCII-only source (valid UTF-8); Unicode is constructed inside SQL Server.
IF DB_NAME() <> 'lab_platform' THROW 51000, 'Expected lab_platform DEV database', 1;
SET XACT_ABORT ON;
DECLARE @company UNIQUEIDENTIFIER = '758914b0-be87-44c1-8b5c-cac23a4399cf';
DECLARE @customer UNIQUEIDENTIFIER = 'ee570f9d-c903-4de7-8826-d610f3dafd0b';
DECLARE @demo NVARCHAR(30) = N'demonstra' + NCHAR(231) + NCHAR(227) + N'o';
DECLARE @companyName NVARCHAR(250) = N'Empresa ' + @demo + N' DEV';
DECLARE @userName NVARCHAR(250) = N'Cliente ' + @demo;
DECLARE @city NVARCHAR(120) = N'Goi' + NCHAR(226) + N'nia';
BEGIN TRY
  BEGIN TRANSACTION;
  IF NOT EXISTS (
    SELECT 1 FROM customer_user u WITH (UPDLOCK,HOLDLOCK)
    JOIN customer_company c WITH (UPDLOCK,HOLDLOCK) ON c.id=u.company_id
    WHERE u.id=@customer AND c.id=@company AND u.email=N'cliente@example.test'
      AND u.name IN (N'Cliente demonstra????o',@userName)
      AND c.name IN (N'Empresa demonstra????o DEV',@companyName)
      AND c.city IN (N'Goi??nia',@city)
  ) THROW 51001, 'DEV identity or expected values changed; inspect before repairing', 1;
  UPDATE customer_company SET name=@companyName,city=@city,updated_at=SYSUTCDATETIME()
    WHERE id=@company AND (name<>@companyName OR city<>@city);
  UPDATE customer_user SET name=@userName,updated_at=SYSUTCDATETIME()
    WHERE id=@customer AND company_id=@company AND name<>@userName;
  COMMIT;
END TRY
BEGIN CATCH
  IF XACT_STATE()<>0 ROLLBACK;
  THROW;
END CATCH;
SELECT u.id AS customerUserId,u.name AS customerName,c.id AS customerCompanyId,
       c.name AS companyName,c.city
FROM customer_user u JOIN customer_company c ON c.id=u.company_id
WHERE u.id=@customer AND c.id=@company;

```
