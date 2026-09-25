-- Opcional (DEV): define a senha Cliente@2026 para o cliente de demonstração criado por create-dev-customer.sql.
-- Execute manualmente em lab_platform depois de V6. Nunca execute em produção.
IF DB_NAME() <> 'lab_platform' THROW 51000, 'Expected lab_platform DEV database', 1;
UPDATE customer_user
   SET password_hash = N'pbkdf2-sha256$210000$1s7HpaP3zXD1mcacm9oSMw==$MeSrh3EFMWlorWzMTrvGaKxNmHcI2qpiKhF49PwZuGo=', updated_at = SYSUTCDATETIME()
 WHERE email = 'cliente@example.test';
SELECT id, email, CASE WHEN password_hash IS NULL THEN 'sem senha' ELSE 'senha definida' END AS situacao FROM customer_user WHERE email = 'cliente@example.test';
