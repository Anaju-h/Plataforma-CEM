/*
  Apaga TODOS os dados operacionais de teste (SOL, ORC, propostas, PRJ e base de conhecimento)
  e reinicia as numerações. Mantém: usuários internos, vocabulário do conhecimento,
  configurações e a conta de cliente de desenvolvimento (cliente@example.test).
  Recusa qualquer banco que não seja lab_platform.
*/
IF DB_NAME() <> N'lab_platform'
  THROW 51000, 'Este script só pode ser executado em lab_platform.', 1;
GO

BEGIN TRANSACTION;
-- Base de conhecimento
DELETE FROM km_notice;
DELETE FROM km_lesson_subject;
DELETE FROM km_lesson;
DELETE FROM km_record_resource;
DELETE FROM km_record_cause;
DELETE FROM km_record;
-- Projetos (PRJ)
DELETE FROM project_history;
DELETE FROM project_time_entry;
DELETE FROM project_task;
DELETE FROM lab_project;
-- Orçamentos e propostas (ORC)
DELETE FROM quote_proposal_version;
DELETE FROM quote_proposal;
DELETE FROM quote_history;
DELETE FROM quote_item;
DELETE FROM quote_piece_service;
DELETE FROM quote_piece;
DELETE FROM quote_service;
DELETE FROM lab_quote;
-- Solicitações (SOL)
DELETE FROM piece_service;
DELETE FROM request_history;
DELETE FROM request_analysis;
DELETE FROM request_piece;
DELETE FROM request_service;
DELETE FROM lab_request;
-- Contas de cliente criadas durante os testes (mantém a conta de desenvolvimento)
DELETE FROM customer_user WHERE email <> N'cliente@example.test';
DELETE c FROM customer_company c WHERE NOT EXISTS (SELECT 1 FROM customer_user u WHERE u.company_id = c.id);
COMMIT TRANSACTION;
GO
ALTER SEQUENCE request_code_seq RESTART WITH 1;
ALTER SEQUENCE quote_code_seq RESTART WITH 1;
ALTER SEQUENCE project_code_seq RESTART WITH 1;
ALTER SEQUENCE km_record_seq RESTART WITH 1;
ALTER SEQUENCE km_lesson_seq RESTART WITH 1;
GO
