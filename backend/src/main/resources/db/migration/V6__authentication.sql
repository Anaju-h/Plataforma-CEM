-- Autenticação: usuários internos com perfis do módulo de conhecimento e senha das contas de cliente.
-- Senhas usam PBKDF2-SHA256 (JDK) com sal aleatório; nenhuma senha em texto claro.
CREATE TABLE internal_user (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 name NVARCHAR(200) NOT NULL,
 email NVARCHAR(320) NOT NULL,
 role NVARCHAR(20) NOT NULL,
 password_hash NVARCHAR(200) NOT NULL,
 active BIT NOT NULL,
 demo BIT NOT NULL,
 created_at DATETIME2 NOT NULL,
 updated_at DATETIME2 NOT NULL,
 CONSTRAINT UQ_internal_user_email UNIQUE(email),
 CONSTRAINT CK_internal_user_role CHECK(role IN (N'CONSULTA',N'TECNICO',N'VALIDADOR',N'ADMIN'))
);
ALTER TABLE customer_user ADD password_hash NVARCHAR(200) NULL;
ALTER TABLE lab_request ADD claim_token_hash NVARCHAR(100) NULL;
GO
-- Contas de demonstração (senha: Lab@2026). Marcadas como demo; troque/desative antes de uso real.
INSERT INTO internal_user(id,name,email,role,password_hash,active,demo,created_at,updated_at) VALUES
 ('7c1f3a52-1b1e-4d0a-9f00-000000000001',N'Carla Consulta',N'consulta@lab.local',N'CONSULTA',N'pbkdf2-sha256$210000$D4GOVg2Ji4yNVj7BG7620w==$YPCtyiO/CmZ7DPMP/EgM1+lC40Ugr9gNB7kTS9+qvlA=',1,1,SYSUTCDATETIME(),SYSUTCDATETIME()),
 ('7c1f3a52-1b1e-4d0a-9f00-000000000002',N'Tiago Técnico',N'tecnico@lab.local',N'TECNICO',N'pbkdf2-sha256$210000$kkyBVkb/EpvmZtSWFn3QqQ==$c9vhTlHhxlvBJTMmfWVGX1TxajRPX+cCIeu/3UeAzro=',1,1,SYSUTCDATETIME(),SYSUTCDATETIME()),
 ('7c1f3a52-1b1e-4d0a-9f00-000000000003',N'Vera Validadora',N'validador@lab.local',N'VALIDADOR',N'pbkdf2-sha256$210000$ykUVzpWpjJ8Wljr9zrhp9w==$TbJG7XHP6d6/LaN9gMiOvZVcS1+9U7OpY1ve2d1SwyY=',1,1,SYSUTCDATETIME(),SYSUTCDATETIME()),
 ('7c1f3a52-1b1e-4d0a-9f00-000000000004',N'Administrador',N'admin@lab.local',N'ADMIN',N'pbkdf2-sha256$210000$k+kfmiWXAI4g2lavemjmGg==$0m5LKWXG2KbvINv/KJeAAGpFNfh22aRGWANSL0okksM=',1,1,SYSUTCDATETIME(),SYSUTCDATETIME());
