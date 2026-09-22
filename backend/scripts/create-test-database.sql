IF DB_ID(N'lab_platform_test') IS NULL
BEGIN
  CREATE DATABASE lab_platform_test;
END;
GO

USE lab_platform_test;
GO

IF DATABASE_PRINCIPAL_ID(N'lab_app') IS NULL
BEGIN
  CREATE USER lab_app FOR LOGIN lab_app;
END;
GO

ALTER ROLE db_owner ADD MEMBER lab_app;
GO
