/*
  Local development only. Run explicitly against lab_platform after checking
  that no data must be preserved. This script refuses every other database.
*/
IF DB_NAME() <> N'lab_platform'
  THROW 51000, 'Este script só pode ser executado em lab_platform.', 1;
GO

BEGIN TRANSACTION;
DELETE FROM piece_service;
DELETE FROM request_history;
DELETE FROM request_analysis;
DELETE FROM request_piece;
DELETE FROM request_service;
DELETE FROM lab_request;
ALTER SEQUENCE request_code_seq RESTART WITH 1;
COMMIT TRANSACTION;
GO
