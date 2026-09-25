-- Tarefas delegadas por projeto (responsável, prazo, horas planejadas) e apontamento de horas gastas.
-- Volta a marcação de demonstração no conhecimento (SOL/ORC/PRJ usam lab_request.source = 'demo').
ALTER TABLE project_task ADD
 assignee_id UNIQUEIDENTIFIER NULL CONSTRAINT FK_task_assignee REFERENCES internal_user(id),
 status NVARCHAR(16) NOT NULL CONSTRAINT DF_task_status DEFAULT N'TODO',
 description NVARCHAR(MAX) NULL,
 due_date DATE NULL,
 planned_hours DECIMAL(10,2) NULL,
 created_at DATETIME2 NULL,
 updated_at DATETIME2 NULL,
 completed_at DATETIME2 NULL;
GO
UPDATE project_task SET status = CASE WHEN completed = 1 THEN N'DONE' ELSE N'TODO' END;
ALTER TABLE project_task ADD CONSTRAINT CK_task_status CHECK(status IN (N'TODO',N'DOING',N'DONE'));
ALTER TABLE project_task ADD CONSTRAINT CK_task_planned CHECK(planned_hours IS NULL OR planned_hours >= 0);
CREATE INDEX IX_task_assignee ON project_task(assignee_id,status);
GO
CREATE TABLE project_time_entry (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 task_id UNIQUEIDENTIFIER NOT NULL REFERENCES project_task(id),
 user_id UNIQUEIDENTIFIER NOT NULL REFERENCES internal_user(id),
 work_date DATE NOT NULL,
 hours DECIMAL(6,2) NOT NULL,
 note NVARCHAR(500) NULL,
 created_at DATETIME2 NOT NULL,
 CONSTRAINT CK_time_hours CHECK(hours > 0 AND hours <= 24)
);
CREATE INDEX IX_time_task ON project_time_entry(task_id);
CREATE INDEX IX_time_user ON project_time_entry(user_id,work_date);
GO
ALTER TABLE km_record ADD demo BIT NOT NULL CONSTRAINT DF_km_record_demo DEFAULT 0;
ALTER TABLE km_lesson ADD demo BIT NOT NULL CONSTRAINT DF_km_lesson_demo DEFAULT 0;
