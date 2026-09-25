-- Módulo de Gestão do Conhecimento em Orçamentação.
-- Ciclo: Criar (registro/lição) → Organizar (vocabulário, sigilo) → Formalizar (validação)
--        → Disseminar (avisos) → Aplicar (Assistente) → Evoluir (indicadores).
-- A base real começa vazia. Registros de demonstração têm demo = 1 e são apagáveis em uma ação.

CREATE TABLE km_term (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 class_code NVARCHAR(30) NOT NULL,
 label NVARCHAR(150) NOT NULL,
 description NVARCHAR(MAX) NULL,
 guidance NVARCHAR(MAX) NULL,
 active BIT NOT NULL,
 sort_order INT NOT NULL,
 created_at DATETIME2 NOT NULL,
 updated_at DATETIME2 NOT NULL,
 CONSTRAINT UQ_km_term_label UNIQUE(class_code,label),
 CONSTRAINT CK_km_term_class CHECK(class_code IN (N'SERVICE_TYPE',N'MATERIAL',N'SIZE',N'COMPLEXITY',N'FEATURE_COUNT',N'GDT',N'RESOURCE',N'DEVIATION_CAUSE'))
);

CREATE SEQUENCE km_record_seq AS BIGINT START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE km_lesson_seq AS BIGINT START WITH 1 INCREMENT BY 1;

CREATE TABLE km_record (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 code NVARCHAR(20) NOT NULL,
 demo BIT NOT NULL,
 confidentiality NVARCHAR(12) NOT NULL,
 status NVARCHAR(12) NOT NULL,
 quote_code NVARCHAR(40) NULL,
 client_code NVARCHAR(60) NULL,
 service_type_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 size_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 material_id UNIQUEIDENTIFIER NULL REFERENCES km_term(id),
 complexity_id UNIQUEIDENTIFIER NULL REFERENCES km_term(id),
 feature_count_id UNIQUEIDENTIFIER NULL REFERENCES km_term(id),
 gdt_id UNIQUEIDENTIFIER NULL REFERENCES km_term(id),
 estimated_hours DECIMAL(10,2) NOT NULL,
 estimated_cost DECIMAL(14,2) NULL,
 proposed_value DECIMAL(14,2) NULL,
 planned_delivery DATE NULL,
 assumptions NVARCHAR(MAX) NULL,
 estimated_by NVARCHAR(200) NOT NULL,
 estimated_at DATETIME2 NOT NULL,
 recommendation_json NVARCHAR(MAX) NULL,
 deviation_justification NVARCHAR(MAX) NULL,
 actual_hours DECIMAL(10,2) NULL,
 actual_cost DECIMAL(14,2) NULL,
 billed_value DECIMAL(14,2) NULL,
 actual_delivery DATE NULL,
 rework BIT NULL,
 scope_change BIT NULL,
 closed_by NVARCHAR(200) NULL,
 closed_at DATETIME2 NULL,
 created_at DATETIME2 NOT NULL,
 updated_at DATETIME2 NOT NULL,
 CONSTRAINT UQ_km_record_code UNIQUE(code),
 CONSTRAINT CK_km_record_status CHECK(status IN (N'OPEN',N'CLOSED')),
 CONSTRAINT CK_km_record_conf CHECK(confidentiality IN (N'PUBLIC',N'RESTRICTED')),
 CONSTRAINT CK_km_record_hours CHECK(estimated_hours > 0),
 -- Regra central: registro fechado exige o bloco B completo.
 CONSTRAINT CK_km_record_closed CHECK(status = N'OPEN' OR (actual_hours IS NOT NULL AND actual_delivery IS NOT NULL AND rework IS NOT NULL AND scope_change IS NOT NULL AND closed_at IS NOT NULL))
);
CREATE INDEX IX_km_record_lookup ON km_record(service_type_id,size_id,status,demo);
CREATE INDEX IX_km_record_quote ON km_record(quote_code);

CREATE TABLE km_record_resource (
 record_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_record(id),
 term_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 CONSTRAINT PK_km_record_resource PRIMARY KEY(record_id,term_id)
);
CREATE TABLE km_record_cause (
 record_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_record(id),
 term_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 CONSTRAINT PK_km_record_cause PRIMARY KEY(record_id,term_id)
);

CREATE TABLE km_lesson (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 code NVARCHAR(20) NOT NULL,
 record_id UNIQUEIDENTIFIER NULL REFERENCES km_record(id),
 demo BIT NOT NULL,
 confidentiality NVARCHAR(12) NOT NULL,
 status NVARCHAR(16) NOT NULL,
 title NVARCHAR(200) NOT NULL,
 body NVARCHAR(MAX) NOT NULL,
 author NVARCHAR(200) NOT NULL,
 created_at DATETIME2 NOT NULL,
 updated_at DATETIME2 NOT NULL,
 submitted_at DATETIME2 NULL,
 validated_by NVARCHAR(200) NULL,
 validated_at DATETIME2 NULL,
 validation_note NVARCHAR(MAX) NULL,
 superseded_by NVARCHAR(200) NULL,
 superseded_at DATETIME2 NULL,
 superseded_reason NVARCHAR(MAX) NULL,
 CONSTRAINT UQ_km_lesson_code UNIQUE(code),
 CONSTRAINT CK_km_lesson_status CHECK(status IN (N'DRAFT',N'IN_VALIDATION',N'FORMALIZED',N'SUPERSEDED')),
 CONSTRAINT CK_km_lesson_conf CHECK(confidentiality IN (N'PUBLIC',N'RESTRICTED'))
);
CREATE INDEX IX_km_lesson_record ON km_lesson(record_id);
CREATE TABLE km_lesson_subject (
 lesson_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_lesson(id),
 term_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 CONSTRAINT PK_km_lesson_subject PRIMARY KEY(lesson_id,term_id)
);

CREATE TABLE km_subscription (
 user_id UNIQUEIDENTIFIER NOT NULL REFERENCES internal_user(id),
 term_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_term(id),
 CONSTRAINT PK_km_subscription PRIMARY KEY(user_id,term_id)
);
CREATE TABLE km_notice (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 user_id UNIQUEIDENTIFIER NOT NULL REFERENCES internal_user(id),
 lesson_id UNIQUEIDENTIFIER NOT NULL REFERENCES km_lesson(id),
 reason NVARCHAR(400) NOT NULL,
 created_at DATETIME2 NOT NULL,
 read_at DATETIME2 NULL
);
CREATE INDEX IX_km_notice_user ON km_notice(user_id,read_at);

CREATE TABLE km_setting (
 setting_key NVARCHAR(60) NOT NULL PRIMARY KEY,
 setting_value NVARCHAR(200) NOT NULL,
 updated_at DATETIME2 NOT NULL
);
INSERT INTO km_setting(setting_key,setting_value,updated_at) VALUES (N'assertiveness_tolerance',N'0.15',SYSUTCDATETIME());
GO

-- Vocabulário controlado inicial (estrutura, não histórico). Editável pelo Administrador.
DECLARE @now DATETIME2 = SYSUTCDATETIME();
INSERT INTO km_term(id,class_code,label,description,guidance,active,sort_order,created_at,updated_at) VALUES
 (NEWID(),N'SERVICE_TYPE',N'Medição dimensional em MMC',N'Medição por coordenadas (tátil/óptica) com relatório dimensional.',N'1. Contar características a medir e quais têm GD&T.
2. Definir fixação: dispositivo existente ou dedicado?
3. Estimar programação CNC (peça nova ≈ 40–60% do esforço total).
4. Somar alinhamento, medição por peça × quantidade e relatório.
5. Registrar premissas: desenho recebido, estabilização térmica, amostragem.',1,10,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Digitalização 3D',N'Escaneamento óptico por luz estruturada/laser com malha STL.',N'1. Avaliar superfície (brilho/escuridão exige spray?).
2. Definir necessidade de marcadores de referência.
3. Estimar número de posições pelo porte e geometria.
4. Incluir tratamento de malha e comparação com CAD, se pedida.
5. Registrar premissas: acabamento, acesso à peça, formato de entrega.',1,20,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Engenharia reversa',N'Reconstrução de modelo CAD a partir de digitalização.',N'1. Confirmar nível de detalhe exigido (paramétrico ou superfícies).
2. Estimar digitalização conforme roteiro de Digitalização 3D.
3. Estimar modelagem por feature relevante.
4. Prever rodada de validação com o cliente.
5. Registrar premissas: tolerâncias de reconstrução e software de destino.',1,30,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Inspeção por tomografia/raio-X',N'Inspeção interna (porosidade, montagem) por raio-X/CT.',N'1. Verificar material e espessura (penetração).
2. Definir resolução exigida e número de peças por varredura.
3. Estimar reconstrução e análise de porosidade/defeitos.
4. Registrar premissas: critério de aceitação e formato do laudo.',1,40,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Inspeção de primeira peça',N'FAI/PPAP: medição completa de todas as cotas do desenho.',N'1. Contar todas as cotas balonadas do desenho.
2. Separar cotas por recurso (MMC, óptico, manual).
3. Estimar balonamento e relatório no formato do cliente.
4. Registrar premissas: revisão do desenho e norma do relatório.',1,50,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Calibração',N'Calibração de instrumentos/padrões com certificado.',N'1. Identificar grandeza e faixa.
2. Verificar padrão rastreável disponível.
3. Estimar pontos de calibração e repetições.
4. Registrar premissas: condições ambientais e incerteza pretendida.',1,60,@now,@now),
 (NEWID(),N'SERVICE_TYPE',N'Elaboração de laudo',N'Laudo técnico a partir de medições/análises.',N'1. Definir escopo e perguntas a responder.
2. Estimar análise de dados existentes.
3. Estimar redação e revisão técnica.
4. Registrar premissas: dados de entrada disponíveis.',1,70,@now,@now),
 (NEWID(),N'MATERIAL',N'Aço',NULL,NULL,1,10,@now,@now),
 (NEWID(),N'MATERIAL',N'Alumínio',NULL,NULL,1,20,@now,@now),
 (NEWID(),N'MATERIAL',N'Ferro fundido',NULL,NULL,1,30,@now,@now),
 (NEWID(),N'MATERIAL',N'Polímero',NULL,NULL,1,40,@now,@now),
 (NEWID(),N'MATERIAL',N'Compósito',NULL,NULL,1,50,@now,@now),
 (NEWID(),N'MATERIAL',N'Outro',NULL,NULL,1,90,@now,@now),
 (NEWID(),N'SIZE',N'Pequeno',N'Maior dimensão até 100 mm.',NULL,1,10,@now,@now),
 (NEWID(),N'SIZE',N'Médio',N'Maior dimensão de 100 a 500 mm.',NULL,1,20,@now,@now),
 (NEWID(),N'SIZE',N'Grande',N'Maior dimensão de 500 a 1500 mm.',NULL,1,30,@now,@now),
 (NEWID(),N'SIZE',N'Muito grande',N'Maior dimensão acima de 1500 mm.',NULL,1,40,@now,@now),
 (NEWID(),N'COMPLEXITY',N'Baixa',N'Geometria prismática, poucas superfícies livres.',NULL,1,10,@now,@now),
 (NEWID(),N'COMPLEXITY',N'Média',N'Mistura de prismáticos e superfícies livres.',NULL,1,20,@now,@now),
 (NEWID(),N'COMPLEXITY',N'Alta',N'Superfícies livres, cavidades, acesso restrito.',NULL,1,30,@now,@now),
 (NEWID(),N'FEATURE_COUNT',N'Até 20 características',NULL,NULL,1,10,@now,@now),
 (NEWID(),N'FEATURE_COUNT',N'21 a 100 características',NULL,NULL,1,20,@now,@now),
 (NEWID(),N'FEATURE_COUNT',N'Mais de 100 características',NULL,NULL,1,30,@now,@now),
 (NEWID(),N'GDT',N'Sem GD&T',N'Somente tolerâncias dimensionais.',NULL,1,10,@now,@now),
 (NEWID(),N'GDT',N'Com GD&T',N'Tolerâncias geométricas de forma, orientação ou posição.',NULL,1,20,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS PRISMO',N'Equipamento: MMC.',NULL,1,10,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS DuraMax',N'Equipamento: MMC.',NULL,1,20,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS O-INSPECT',N'Equipamento: multissensor.',NULL,1,30,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS ATOS Q',N'Equipamento: scanner óptico.',NULL,1,40,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS T-SCAN',N'Equipamento: scanner portátil.',NULL,1,50,@now,@now),
 (NEWID(),N'RESOURCE',N'ZEISS BOSELLO MAX',N'Equipamento: raio-X/tomografia.',NULL,1,60,@now,@now),
 (NEWID(),N'RESOURCE',N'Software ZEISS CALYPSO',N'Software de programação de MMC.',NULL,1,70,@now,@now),
 (NEWID(),N'RESOURCE',N'Software ZEISS INSPECT',N'Software de análise de malhas.',NULL,1,80,@now,@now),
 (NEWID(),N'RESOURCE',N'Sala climatizada',N'Ambiente 20 °C ± 1 °C.',NULL,1,90,@now,@now),
 (NEWID(),N'RESOURCE',N'Dispositivo de fixação dedicado',NULL,NULL,1,100,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Fixação mais complexa que o previsto',NULL,NULL,1,10,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Programação subestimada',NULL,NULL,1,20,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Retrabalho por não conformidade',NULL,NULL,1,30,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Mudança de escopo pelo cliente',NULL,NULL,1,40,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Espera por informação do cliente',NULL,NULL,1,50,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Preparação de superfície não prevista',NULL,NULL,1,60,@now,@now),
 (NEWID(),N'DEVIATION_CAUSE',N'Sem desvio relevante',N'Realizado dentro da tolerância; registrar mesmo assim para o histórico.',NULL,1,90,@now,@now);
