CREATE TABLE site_replications (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name                 VARCHAR(100) NOT NULL,
    source_url                  VARCHAR(500) NOT NULL,
    search_api_url              VARCHAR(500) NOT NULL,
    search_input_selector       VARCHAR(200) NOT NULL,
    search_button_selector      VARCHAR(200),
    results_container_selector  VARCHAR(200) NOT NULL,
    response_mapping            JSONB NOT NULL DEFAULT '{}',
    status                      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message               TEXT,
    cloned_path                 VARCHAR(500),
    created_at                  TIMESTAMP DEFAULT NOW(),
    updated_at                  TIMESTAMP DEFAULT NOW()
);
