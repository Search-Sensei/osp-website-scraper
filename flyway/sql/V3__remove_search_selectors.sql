ALTER TABLE site_replications
DROP COLUMN IF EXISTS search_form_selector,
DROP COLUMN IF EXISTS search_input_selector,
DROP COLUMN IF EXISTS result_row_selector,
DROP COLUMN IF EXISTS result_title_selector,
DROP COLUMN IF EXISTS result_detail_selector,
DROP COLUMN IF EXISTS result_url_selector;
