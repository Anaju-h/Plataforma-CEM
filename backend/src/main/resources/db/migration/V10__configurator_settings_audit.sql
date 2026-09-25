-- Configurador on-line: snapshot técnico completo da configuração enviada.
ALTER TABLE lab_request ADD configuration_json NVARCHAR(MAX) NULL;
GO
-- Configurações do laboratório (antes só na memória do navegador) e trilha administrativa.
CREATE TABLE app_setting (
 setting_key NVARCHAR(80) NOT NULL PRIMARY KEY,
 setting_value NVARCHAR(MAX) NOT NULL,
 updated_at DATETIME2 NOT NULL,
 updated_by NVARCHAR(200) NOT NULL
);
CREATE TABLE admin_audit_event (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 occurred_at DATETIME2 NOT NULL,
 actor NVARCHAR(200) NOT NULL,
 area NVARCHAR(120) NOT NULL,
 action NVARCHAR(200) NOT NULL,
 description NVARCHAR(MAX) NULL
);
CREATE INDEX IX_admin_audit_date ON admin_audit_event(occurred_at DESC);
