ALTER TABLE site_replications
  ADD COLUMN search_form_selector VARCHAR(200),
  ADD COLUMN search_input_selector VARCHAR(200),
  ADD COLUMN result_row_selector VARCHAR(200),
  ADD COLUMN result_title_selector VARCHAR(200),
  ADD COLUMN result_detail_selector VARCHAR(200),
  ADD COLUMN result_url_selector VARCHAR(200);
