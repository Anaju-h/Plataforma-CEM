CREATE SEQUENCE request_code_seq AS BIGINT START WITH 1 INCREMENT BY 1;
CREATE TABLE lab_request (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, request_code VARCHAR(32) NOT NULL UNIQUE,
  source VARCHAR(20) NOT NULL, origin NVARCHAR(40) NOT NULL, channel NVARCHAR(120) NOT NULL,
  company NVARCHAR(250) NOT NULL, contact NVARCHAR(250) NOT NULL, email NVARCHAR(320), phone NVARCHAR(60),
  request_need_id VARCHAR(80) NOT NULL, service VARCHAR(80) NOT NULL,
  created_at DATETIME2 NOT NULL, updated_at DATETIME2 NOT NULL,
  status NVARCHAR(60) NOT NULL, priority NVARCHAR(40) NOT NULL, responsible NVARCHAR(200),
  objective NVARCHAR(MAX), comments NVARCHAR(MAX), internal_notes NVARCHAR(MAX), linked_quote_id VARCHAR(40),
  customer_json NVARCHAR(MAX), project_json NVARCHAR(MAX), attachments_json NVARCHAR(MAX),
  cancellation_reason NVARCHAR(MAX), cancelled_at DATETIME2, cancelled_by NVARCHAR(200), version BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT CK_request_status CHECK (status IN (N'Nova',N'Em análise',N'Aguardando informações',N'Apta para orçamento',N'Convertida em orçamento',N'Recusada',N'Cancelada'))
);
CREATE INDEX IX_request_created ON lab_request(created_at DESC);
CREATE TABLE request_service (request_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_request(id), service_id VARCHAR(80) NOT NULL, PRIMARY KEY(request_id,service_id));
CREATE TABLE request_piece (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, request_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_request(id),
  client_id VARCHAR(100), name NVARCHAR(250) NOT NULL, quantity INT NOT NULL,
  material NVARCHAR(250), dimensions NVARCHAR(250), location NVARCHAR(500),
  type NVARCHAR(100), requirements_json NVARCHAR(MAX), recommendation_json NVARCHAR(MAX),
  CONSTRAINT CK_piece_quantity CHECK (quantity > 0)
);
CREATE INDEX IX_piece_request ON request_piece(request_id);
CREATE TABLE piece_service (piece_id UNIQUEIDENTIFIER NOT NULL REFERENCES request_piece(id), service_id VARCHAR(80) NOT NULL, PRIMARY KEY(piece_id,service_id));
CREATE TABLE request_analysis (
  request_id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY REFERENCES lab_request(id),
  status VARCHAR(40) NOT NULL, responsible NVARCHAR(200), started_at DATETIME2, resumed_at DATETIME2,
  completed_at DATETIME2, updated_at DATETIME2, updated_by NVARCHAR(200), complexity NVARCHAR(100),
  technical_summary NVARCHAR(MAX), pending_information NVARCHAR(MAX), decision_reason NVARCHAR(MAX),
  recommended_service VARCHAR(80), recommended_equipment NVARCHAR(250), knowledge_tags_json NVARCHAR(MAX), result VARCHAR(40)
);
CREATE TABLE request_history (
  id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, request_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_request(id),
  occurred_at DATETIME2 NOT NULL, action NVARCHAR(120) NOT NULL, actor NVARCHAR(200) NOT NULL, description NVARCHAR(MAX)
);
CREATE INDEX IX_history_request_date ON request_history(request_id,occurred_at);
