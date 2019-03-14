CREATE TABLE Policy (
  policy_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (policy_id)
);

--------------------------------------------------

CREATE TABLE Role (
  role_id INT(11) NOT NULL AUTO_INCREMENT,
  policy_id INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (policy_id) REFERENCES Policy(policy_id),
  PRIMARY KEY (role_id)
);

--------------------------------------------------

CREATE TABLE Staff (
  staff_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  s_rank VARCHAR(255) DEFAULT 'Recruit',
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  role_id INT(11) NOT NULL,
  FOREIGN KEY (role_id) REFERENCES ROLE(role_id),
  PRIMARY KEY (staff_id)
);

--------------------------------------------------

CREATE TABLE fire_station (
  call_sign VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  PRIMARY KEY (call_sign)
);

--------------------------------------------------

CREATE TABLE vehicle (
  plate_number VARCHAR(255) NOT NULL,
  call_sign VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  on_off_call BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (plate_number),
  FOREIGN KEY (call_sign) REFERENCES fire_station(call_sign)
);

--------------------------------------------------

CREATE TABLE ops_manager (
  staff_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

--------------------------------------------------

CREATE TABLE ops_operator (
  staff_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

--------------------------------------------------

CREATE TABLE specialist (
  staff_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

--------------------------------------------------

CREATE TABLE relations_officer (
  staff_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

--------------------------------------------------

CREATE TABLE incidents (
  incident_id INT(11) NOT NULL AUTO_INCREMENT,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  call_time DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  casualty_no INT(11) NOT NULL,
  category VARCHAR(255) NOT NULL, -- for search by category
  description VARCHAR(255) NOT NULL,
  status VARCHAR(255) DEFAULT 'NEW', -- will think of a better starting status
  op_create_id INT(11) NOT NULL,
  op_update_id INT(11) DEFAULT NULL,
  FOREIGN KEY (op_create_id) REFERENCES ops_operator(staff_id),
  FOREIGN KEY (op_update_id) REFERENCES ops_operator(staff_id),
  PRIMARY KEY (incident_id)
);

--------------------------------------------------

CREATE TABLE ops_GC (
  staff_id INT(11) NOT NULL,
  call_sign VARCHAR(255) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
  FOREIGN KEY (call_sign) REFERENCES fire_station(call_sign),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE vehicle_incident (
  plate_number VARCHAR(255) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (incident_id, plate_number),
  FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE road_traffic_acc (
  incident_id INT(11) NOT NULL,
  vehicle_type VARCHAR(255) NOT NULL,
  PRIMARY KEY (incident_id),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE fire_emergency (
  incident_id INT(11) NOT NULL,
  fire_spread_rate VARCHAR(255) NOT NULL,
  PRIMARY KEY (incident_id),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE med_emergency (
  incident_id INT(11) NOT NULL,
  cause_description VARCHAR(255) NOT NULL,
  cause VARCHAR(255) NOT NULL,
  PRIMARY KEY (incident_id),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE civil_emergency (
  incident_id INT(11) NOT NULL,
  supp_doc_dir VARCHAR(255) DEFAULT NULL, -- Link to the uploaded supplement document
  ce_handle_id INT(11) NOT NULL,
  ce_upload_id INT(11) NOT NULL,
  PRIMARY KEY (incident_id),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id),
  FOREIGN KEY (ce_handle_id) REFERENCES specialist(staff_id),
  FOREIGN KEY (ce_upload_id) REFERENCES specialist(staff_id)
);

--------------------------------------------------

CREATE TABLE hospital (
  hospital_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  ownership VARCHAR(255) NOT NULL,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  PRIMARY KEY (hospital_id)
);

--------------------------------------------------

CREATE TABLE inc_casualty (
  nric INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  race VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  curr_condition VARCHAR(255) NOT NULL,
  allergy VARCHAR(255) NOT NULL,
  level_of_consc VARCHAR(255) NOT NULL,
  medical_history VARCHAR(255) NOT NULL,
  hospital_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (nric, incident_id, hospital_id),
  FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id),
  FOREIGN KEY (incident_id) REFERENCES incidents(incident_id)
);

--------------------------------------------------

CREATE TABLE email_directory (
  email_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  organisation VARCHAR(255) NOT NULL,
  PRIMARY KEY (email_id)
);

--------------------------------------------------

CREATE TABLE email_log (
  email_log_id INT(11) NOT NULL AUTO_INCREMENT,
  creater_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email_id INT(11) NOT NULL,
  PRIMARY KEY (email_log_id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(incident_id),
  FOREIGN KEY (creater_id) REFERENCES relations_officer(staff_id),
  FOREIGN KEY (email_id) REFERENCES email_directory(email_id) 
);

--------------------------------------------------

CREATE TABLE sms_directory (
  sms_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  number INT(11) NOT NULL,
  PRIMARY KEY (sms_id)
);

--------------------------------------------------

CREATE TABLE sms_log (
  sms_log_id INT(11) NOT NULL AUTO_INCREMENT, 
  creater_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sms_id INT(11) NOT NULL,
  PRIMARY KEY (sms_log_id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(incident_id),
  FOREIGN KEY (creater_id) REFERENCES relations_officer(staff_id),
  FOREIGN KEY (sms_id) REFERENCES sms_directory(sms_id) 
);

--------------------------------------------------

CREATE TABLE social_media_log (
  social_media_log_id INT(11) NOT NULL AUTO_INCREMENT, 
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  staff_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (social_media_log_id),
  FOREIGN KEY (staff_id) REFERENCES relations_officer(staff_id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(incident_id)
);

-------------------------------------------------
  