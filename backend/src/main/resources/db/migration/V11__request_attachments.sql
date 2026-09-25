-- Arquivos enviados com a solicitação (fotos, desenhos, CAD, PDFs). Antes só o nome era guardado.
CREATE TABLE request_attachment (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 request_id UNIQUEIDENTIFIER NOT NULL REFERENCES lab_request(id),
 file_name NVARCHAR(260) NOT NULL,
 content_type NVARCHAR(120) NOT NULL,
 size_bytes BIGINT NOT NULL,
 content VARBINARY(MAX) NOT NULL,
 created_at DATETIME2 NOT NULL
);
CREATE INDEX IX_request_attachment_request ON request_attachment(request_id);
