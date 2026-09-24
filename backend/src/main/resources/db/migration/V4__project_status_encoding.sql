-- Preserve V3 and existing identities/links. Flyway runs this SQL Server migration
-- transactionally. NCHAR makes the legacy byte-decoding artifacts unambiguous.
IF EXISTS (SELECT 1 FROM sys.check_constraints
           WHERE name = N'CK_project_status' AND parent_object_id = OBJECT_ID(N'lab_project'))
    ALTER TABLE lab_project DROP CONSTRAINT CK_project_status;

UPDATE lab_project
SET status = REPLACE(REPLACE(REPLACE(REPLACE(
    status COLLATE Latin1_General_100_BIN2,
    NCHAR(195) + NCHAR(167), N'ç'),
    NCHAR(195) + NCHAR(163), N'ã'),
    NCHAR(195) + NCHAR(173), N'í'),
    N'Conclu' + NCHAR(195) + N'do', N'Concluído')
WHERE status COLLATE Latin1_General_100_BIN2 LIKE N'%' + NCHAR(195) + N'%';

ALTER TABLE lab_project WITH CHECK ADD CONSTRAINT CK_project_status
CHECK (status IN (
    N'Planejamento', N'Aguardando execução', N'Em andamento',
    N'Aguardando revisão', N'Concluído', N'Cancelado'
));
