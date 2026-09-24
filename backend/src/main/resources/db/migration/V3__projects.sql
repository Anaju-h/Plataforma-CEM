CREATE SEQUENCE project_code_seq AS BIGINT START WITH 1 INCREMENT BY 1;
-- Composite keys keep the accepted version in the same commercial chain.
ALTER TABLE quote_proposal ADD CONSTRAINT UQ_proposal_quote_id UNIQUE(quote_id,id);
ALTER TABLE quote_proposal_version ADD CONSTRAINT UQ_version_proposal_id UNIQUE(proposal_id,id);
CREATE TABLE lab_project (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 project_code NVARCHAR(40) NOT NULL UNIQUE,
 quote_id UNIQUEIDENTIFIER NOT NULL UNIQUE REFERENCES lab_quote(id),
 accepted_proposal_id UNIQUEIDENTIFIER NOT NULL,
 accepted_version_id UNIQUEIDENTIFIER NOT NULL,
 responsible NVARCHAR(200),
 status NVARCHAR(60) NOT NULL,
 priority NVARCHAR(40),
 description NVARCHAR(MAX),
 internal_notes NVARCHAR(MAX),
 deadline DATE,
 created_at DATETIME2 NOT NULL,
 updated_at DATETIME2 NOT NULL,
 completed_at DATE,
 revision BIGINT NOT NULL,
 CONSTRAINT FK_project_proposal FOREIGN KEY(quote_id,accepted_proposal_id) REFERENCES quote_proposal(quote_id,id),
 CONSTRAINT FK_project_version FOREIGN KEY(accepted_proposal_id,accepted_version_id) REFERENCES quote_proposal_version(proposal_id,id),
 CONSTRAINT CK_project_status CHECK(status IN(N'Planejamento',N'Aguardando execução',N'Em andamento',N'Aguardando revisão',N'Concluído',N'Cancelado'))
);
CREATE TABLE project_task (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 project_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_project(id),
 position INT NOT NULL,
 title NVARCHAR(250) NOT NULL,
 completed BIT NOT NULL,
 CONSTRAINT UQ_project_task_position UNIQUE(project_id,position)
);
CREATE TABLE project_history (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 project_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_project(id),
 occurred_at DATETIME2 NOT NULL,
 action NVARCHAR(120) NOT NULL,
 actor NVARCHAR(200) NOT NULL,
 description NVARCHAR(MAX)
);
CREATE INDEX IX_project_created ON lab_project(created_at DESC);
CREATE INDEX IX_project_history ON project_history(project_id,occurred_at);
