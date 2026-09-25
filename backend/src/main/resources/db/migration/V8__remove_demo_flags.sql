-- Remove a separação real/demonstração: a base de conhecimento passa a conter somente dados reais do laboratório.
-- Apaga o que foi marcado como demonstração e remove as colunas demo.
DELETE n FROM km_notice n JOIN km_lesson l ON l.id = n.lesson_id WHERE l.demo = 1;
DELETE s FROM km_lesson_subject s JOIN km_lesson l ON l.id = s.lesson_id WHERE l.demo = 1;
DELETE FROM km_lesson WHERE demo = 1;
DELETE n FROM km_notice n JOIN km_lesson l ON l.id = n.lesson_id JOIN km_record r ON r.id = l.record_id WHERE r.demo = 1;
DELETE s FROM km_lesson_subject s JOIN km_lesson l ON l.id = s.lesson_id JOIN km_record r ON r.id = l.record_id WHERE r.demo = 1;
DELETE l FROM km_lesson l JOIN km_record r ON r.id = l.record_id WHERE r.demo = 1;
DELETE x FROM km_record_resource x JOIN km_record r ON r.id = x.record_id WHERE r.demo = 1;
DELETE x FROM km_record_cause x JOIN km_record r ON r.id = x.record_id WHERE r.demo = 1;
DELETE FROM km_record WHERE demo = 1;
GO
DROP INDEX IX_km_record_lookup ON km_record;
ALTER TABLE km_record DROP COLUMN demo;
ALTER TABLE km_lesson DROP COLUMN demo;
ALTER TABLE internal_user DROP COLUMN demo;
GO
CREATE INDEX IX_km_record_lookup ON km_record(service_type_id,size_id,status);
GO
-- Perfis internos identificados apenas pelo cargo.
UPDATE internal_user SET name = N'Administrador', updated_at = SYSUTCDATETIME() WHERE email = N'admin@lab.local';
UPDATE internal_user SET name = N'Validador', updated_at = SYSUTCDATETIME() WHERE email = N'validador@lab.local';
UPDATE internal_user SET name = N'Técnico', updated_at = SYSUTCDATETIME() WHERE email = N'tecnico@lab.local';
UPDATE internal_user SET name = N'Consulta', updated_at = SYSUTCDATETIME() WHERE email = N'consulta@lab.local';
