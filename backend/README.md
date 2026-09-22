# Backend de solicitações (Missão 1)

Java 21, Quarkus 3.39.4, Maven 3.9.16, Hibernate ORM gerenciado pelo BOM, MapStruct 1.6.3, Microsoft JDBC 13.4.0 e SQL Server 2022 ou versão posterior suportada.

## Banco e execução

Crie um banco vazio `lab_platform` no SQL Server e um usuário com permissão para criar tabelas, índices e sequências no schema da aplicação. Configure `JDBC_DATABASE_URL`, `DB_USER` e `DB_PASSWORD` por variáveis de ambiente, conforme `.env.example`. Use TLS válido no servidor; `trustServerCertificate=false` é intencional. Nenhuma senha é versionada.

```powershell
$env:JDBC_DATABASE_URL='jdbc:sqlserver://servidor:1433;databaseName=lab_platform;encrypt=true;trustServerCertificate=false'
$env:DB_USER='lab_app'
$env:DB_PASSWORD='<senha>'
mvn -B test
mvn quarkus:dev
```

O Flyway aplica `V1__requests.sql` ao iniciar. A execução normal usa `quarkus.flyway.migrate-at-start=true` e `hibernate-orm.schema-management.strategy=validate`; reinicie o backend após alterações para validar as migrations contra o mesmo banco.

```powershell
docker build -t lab-backend ./backend
docker run --env-file backend/.env -p 8080:8080 lab-backend
```

O arquivo `.env` deve ser criado localmente e mantido fora do Git. Um SQL Server externo também funciona; Docker não é requisito. Frontend e backend são processos/containers separados. No desenvolvimento, Vite encaminha `/api` ao backend. Em produção, NGINX ou Ingress deve encaminhar `/api` ao backend na mesma origem, terminar TLS e aplicar controle de acesso quando a autenticação corporativa for implantada.

## Modelo

`lab_request` guarda a SOL, dados de contato, estado e cancelamento; `request_service` guarda IDs canônicos. `request_piece` e `piece_service` guardam as peças e seus serviços; `request_analysis` mantém a análise; `request_history` contém eventos criados pelo serviço e nunca aceita substituição pela API. Requisitos variáveis do configurador e snapshots de recomendação ficam em JSON dentro da peça; os relacionamentos operacionais continuam relacionais. Anexos são apenas metadados e não têm upload físico nesta missão.

O identificador técnico é UUID. `SOL-XXXX` usa `NEXT VALUE FOR request_code_seq`, uma sequência atômica do SQL Server iniciada em 1000 para não colidir com códigos da base demo legada; lacunas são normais após rollback. A restrição `UNIQUE` reforça a proteção contra concorrência.

## API

`GET /api/requests`, `GET /api/requests/{id}`, `POST /api/requests`, `POST /api/requests/{id}/analysis/start`, `PUT /api/requests/{id}/analysis`, `POST /api/requests/{id}/analysis/resume`, `POST /api/requests/{id}/analysis/finish`, `PUT /api/requests/{id}/internal-notes`, `PUT /api/requests/{id}/responsible`, `POST /api/requests/{id}/cancel`.

O backend valida serviços e transições. `Convertida em orçamento` permanece no schema, mas não há endpoint de conversão até a Missão 2. ORC, propostas, projetos, área do cliente, autenticação e permissões reais permanecem fora desta missão. Antes de expor a API a usuários finais, a infraestrutura deverá definir OIDC/JWT, perfis, WAF/firewall, política de backup e retenção, tratamento de dados pessoais e observabilidade. TLS em produção pertence ao proxy/Ingress. Não há criptografia caseira.
