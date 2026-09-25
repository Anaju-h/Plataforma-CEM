-- Explicit, optional DEV provisioning. Not a migration or automatic business seed.
-- Run manually against lab_platform after V5. Never run this script in production.
IF DB_NAME() <> 'lab_platform' THROW 51000, 'Expected lab_platform DEV database', 1;
DECLARE @company UNIQUEIDENTIFIER = NEWID(), @customer UNIQUEIDENTIFIER = NEWID();
-- ASCII-only SQL source is also valid UTF-8. NCHAR keeps Unicode intact even
-- when an external shell/client reads or pipes this file through a legacy code page.
DECLARE @demo NVARCHAR(30) = N'demonstra' + NCHAR(231) + NCHAR(227) + N'o';
DECLARE @city NVARCHAR(120) = N'Goi' + NCHAR(226) + N'nia';
SET XACT_ABORT ON;
BEGIN TRANSACTION;
INSERT INTO customer_company(id,name,phone,city,state,created_at,updated_at)
 VALUES(@company,N'Empresa ' + @demo + N' DEV',N'62999999999',@city,N'GO',SYSUTCDATETIME(),SYSUTCDATETIME());
INSERT INTO customer_user(id,company_id,name,email,phone,active,created_at,updated_at)
 VALUES(@customer,@company,N'Cliente ' + @demo,'cliente@example.test',N'62999999999',1,SYSUTCDATETIME(),SYSUTCDATETIME());
COMMIT;
SELECT @customer AS LAB_CUSTOMER_DEMO_USER_ID, @company AS customerCompanyId;
