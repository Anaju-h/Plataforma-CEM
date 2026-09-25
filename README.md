# Plataforma do Laboratório de Metrologia — SENAI · ZEISS

Plataforma web do Centro de Excelência em Metrologia: site institucional, solicitação de atendimento, **área do cliente**, **área interna de gestão** (SOL → ORC → proposta → PRJ) e o **Módulo de Gestão do Conhecimento em Orçamentação**.

## Stack (alinhada ao padrão DS-059)

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, JavaScript (sem TypeScript), Vite, Tailwind CSS, React Router, Yarn |
| Backend | Java 21, Quarkus, Hibernate ORM, MapStruct, Flyway, SmallRye JWT, Maven |
| Banco | SQL Server 2019+ (Docker Compose incluído para DEV) |
| Segurança | JWT assinado (RS256) somente em cookie HttpOnly/SameSite=Strict; senhas PBKDF2-SHA256; autorização por perfil no backend |

## Estrutura

```
frontend/          React + Vite (área pública, /cliente, /portal)
  src/pages/       páginas públicas, customer/, internal/, internal/knowledge/
  src/services/    clientes da API (requestApi, quoteApi, projectApi, authApi, knowledgeApi…)
backend/           Quarkus
  src/main/java/br/org/senai/lab/
    resource/      endpoints REST (/api/…)
    service/       regras de SOL, ORC, proposta, PRJ, cliente, autenticação
    knowledge/     módulo de conhecimento (vocabulário, registros, lições, Assistente, indicadores)
    security/      JWT em cookie, hash de senha, usuário atual
  src/main/resources/db/migration/   V1–V10 (Flyway)
docs/              decisões e integrações por missão; docs/knowledge-module.md (módulo + roteiro)
```

## Como executar localmente

Pré-requisitos: Java 21, Maven 3.9+, Node LTS + Yarn, SQL Server (ou Docker).

1. **Banco**: crie `.env` na raiz com `MSSQL_SA_PASSWORD` e `DB_PASSWORD` e rode `docker compose up -d`. Crie o banco `lab_platform` e o usuário da aplicação.
2. **Backend** (`backend/`): configure `JDBC_DATABASE_URL`, `DB_USER` e `DB_PASSWORD` (veja `backend/.env.example`) e rode `mvn quarkus:dev`. O Flyway aplica as migrations V1–V10 na subida. API em `http://localhost:8080`.
3. **Frontend** (`frontend/`): `yarn install` e `yarn dev`. O Vite encaminha `/api` ao backend. Acesse `http://localhost:5173`.

Testes: `mvn test` (usa o banco isolado `lab_platform_test`) e `yarn test`.

## Acessos

| Área | Conta | Senha |
| --- | --- | --- |
| Interna — Consulta / Técnico / Validador / Administrador | `consulta@lab.local`, `tecnico@lab.local`, `validador@lab.local`, `admin@lab.local` | `Lab@2026` |
| Cliente | Acesso rápido na tela `/cliente`: Ana Nunes (`ana@gmail.com`) e Gabriela Nunes (`gabriela.nunes@nunesmetrologia.com.br`); ou crie a conta em `/cliente` ou ao final do formulário público | `Cliente@2026` |

As contas internas são identificadas apenas pelo cargo (Consulta, Técnico, Validador, Administrador). Em produção, troque as senhas iniciais ou use o login corporativo (OIDC). As chaves JWT em `backend/src/main/resources/jwt` servem só para DEV: em produção, informe `LAB_JWT_PUBLIC_KEY`, `LAB_JWT_PRIVATE_KEY` e `LAB_COOKIE_SECURE=true`.

## Configurador on-line

O envio do Configurador cria a SOL com origem **Configurador** (rota pública `/api/public/configurator`, com oferta de conta; cliente logado envia pela própria conta). A área interna mostra o selo e o filtro de origem e a seção **Configuração técnica** (peças, requisitos por serviço e tecnologia recomendada); a tecnologia mais aderente já chega como sugestão na análise e segue para o ORC.

## Configurações e histórico

Padrões do orçamento, regras de atenção, valor/hora de referência e auditoria ficam no banco (`app_setting`, `admin_audit_event`). O histórico de SOL, ORC, proposta e PRJ registra o usuário que executou a ação. Minha conta (interno e cliente) grava nome, dados e troca de senha.

## Perfis e tarefas

- **Administrador**: operação completa (SOL, ORC, propostas, PRJ), Equipe, Quadro de tarefas, custos e Administração. Cria perfis e delega tarefas.
- **Validador / Técnico**: Meu trabalho, somente os PRJ com tarefas delegadas a eles (sem valores comerciais) e Gestão do Conhecimento. Atualizam o status das próprias tarefas e apontam horas.
- **Consulta**: somente leitura; não recebe tarefas.
- O bloqueio é feito no backend (políticas HTTP + regras nos serviços) e refletido no menu.
- Cada PRJ mostra horas **orçadas (ORC) × planejadas (tarefas) × gastas (apontamentos)**. A soma das horas apontadas preenche o realizado (bloco B) do Registro de Serviço.

## Dados de demonstração

Administração → *Dados de demonstração* carrega projetos fictícios (etiqueta DEMO em todas as telas) com tarefas delegadas, horas, registros fechados e lições formalizadas, e remove tudo em uma ação sem tocar nos dados reais.

## Dados operacionais

`backend/scripts/reset-operational-data.sql` apaga SOL, ORC, propostas, PRJ e registros do conhecimento (mantém usuários, vocabulário e a conta de cliente DEV). Os serviços reais do laboratório são cadastrados no sistema rodando; o script de carga fica em `private-data/` (fora do Git) por conter dados de clientes.

## Fluxo principal

1. **Solicitação (SOL)**: pelo site (`/orcamento`), pela área do cliente ou registrada pela equipe. A origem (Público, Cliente ou Interno) fica visível na área interna. Ao enviar pelo site, o visitante pode criar a conta e a SOL é vinculada a ela por um token de uso único.
2. **Análise técnica** → **Orçamento (ORC)** com composição de horas e equipamentos. O **Assistente de Orçamento** consulta casos parecidos já formalizados.
3. **Proposta comercial** versionada no Proposal Builder. O cliente vê, baixa o PDF e aceita ou recusa na área do cliente (com confirmação).
4. **Projeto (PRJ)** criado a partir da proposta aceita. Só é concluído com o **Registro de Serviço** fechado (blocos B – realizado e C – aprendizado).
5. **Conhecimento**: lição validada → aviso a quem assina o assunto → próxima recomendação mais precisa.

Detalhes do módulo, vocabulário e roteiro de apresentação: [`docs/knowledge-module.md`](docs/knowledge-module.md).

## Idiomas (PT · EN · DE)

A área pública (site, orçamento, configurador e acesso do cliente) troca de idioma pelo seletor do cabeçalho. O português é a fonte. `src/i18n/translations.js` tem o dicionário PT → EN/DE, carregado sob demanda, e `AutoTranslate` aplica o idioma aos textos renderizados sem alterar os componentes. Ao criar ou alterar textos, rode `python scripts/i18n-extract.py` na pasta `frontend` para listar o que ainda falta traduzir. As áreas do cliente e interna permanecem em português.

## Dados técnicos dos equipamentos

`src/data/equipmentSpecs.js` concentra MPE, volume, resolução e demais dados das fichas públicas da ZEISS (configuração base de cada linha). Eles são usados em Equipamentos, Serviços e no resumo do configurador. Confirme a configuração exata de cada máquina do Centro antes de usar os valores em especificação contratual.
