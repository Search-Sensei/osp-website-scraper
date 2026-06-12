CREATE TABLE site_replications (
    id            VARCHAR(100) PRIMARY KEY,
    client_name   VARCHAR(100) NOT NULL,
    source_url    VARCHAR(500) NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    cloned_path   VARCHAR(500),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);
