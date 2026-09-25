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
