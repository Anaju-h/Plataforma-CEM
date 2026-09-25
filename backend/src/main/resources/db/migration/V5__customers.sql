CREATE TABLE customer_company (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 name NVARCHAR(250) NOT NULL, document NVARCHAR(60), phone NVARCHAR(60),
 city NVARCHAR(120), state NVARCHAR(60),
 created_at DATETIME2 NOT NULL, updated_at DATETIME2 NOT NULL
);
CREATE TABLE customer_user (
 id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 company_id UNIQUEIDENTIFIER NOT NULL REFERENCES customer_company(id),
 name NVARCHAR(250) NOT NULL, email NVARCHAR(320) NOT NULL, phone NVARCHAR(60),
 active BIT NOT NULL, created_at DATETIME2 NOT NULL, updated_at DATETIME2 NOT NULL,
 CONSTRAINT UQ_customer_user_company UNIQUE(id, company_id)
);
ALTER TABLE lab_request ADD customer_company_id UNIQUEIDENTIFIER NULL,
 customer_user_id UNIQUEIDENTIFIER NULL;
GO
ALTER TABLE lab_request ADD CONSTRAINT FK_request_customer_company
 FOREIGN KEY(customer_company_id) REFERENCES customer_company(id);
ALTER TABLE lab_request ADD CONSTRAINT FK_request_customer_user
 FOREIGN KEY(customer_user_id,customer_company_id) REFERENCES customer_user(id,company_id);
ALTER TABLE lab_request ADD CONSTRAINT CK_request_customer_link
 CHECK(customer_user_id IS NULL OR customer_company_id IS NOT NULL);
CREATE INDEX IX_request_customer ON lab_request(customer_company_id,customer_user_id,created_at DESC);
