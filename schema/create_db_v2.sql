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
  on_off_call VARCHAR(255) NOT NULL,
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
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (staff_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

--------------------------------------------------

CREATE TABLE incidents (
  incident_id INT(11) NOT NULL,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  completed_at DATETIME NOT NULL,
  addi_desc VARCHAR(255) NOT NULL,
  casualty_no INT(11) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  op_create_id INT(11) NOT NULL,
  op_update_id INT(11) NOT NULL,
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

CREATE TABLE hospital (
  hospital_id INT(11) NOT NULL,
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