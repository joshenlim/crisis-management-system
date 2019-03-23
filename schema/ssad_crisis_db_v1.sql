CREATE TABLE `role` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `policy` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  role_id INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE `staff` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  s_rank VARCHAR(255) DEFAULT 'REC',
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  role_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE `fire_station` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(17,14) NOT NULL,
  lng DECIMAL(17,14) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `fire_station_gc`(
  id INT(11) NOT NULL,
  fire_station_id INT(11) NOT NULL,
  FOREIGN KEY (id) REFERENCES staff(id),
  FOREIGN KEY (fire_station_id) REFERENCES fire_station(id),
  PRIMARY KEY (id)
);

CREATE TABLE `vehicle` (
  plate_number VARCHAR(255) NOT NULL,
  call_sign VARCHAR(255) NOT NULL,
  fire_station_id INT(11) NOT NULL,
  type VARCHAR(255) NOT NULL,
  on_off_call BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (plate_number),
  FOREIGN KEY (fire_station_id) REFERENCES fire_station(id)
);

CREATE TABLE `incidents` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  caller_name VARCHAR(255) NOT NULL, 
  caller_contact VARCHAR(255) NOT NULL, -- To accomodate for possible input like: +65 99939499 where '+<area_code>' is included
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(17,14) NOT NULL, -- server side will have to automatically log this in
  lng DECIMAL(17,14) NOT NULL, -- server side will have to automatically log this in
  call_time DATETIME NOT NULL, -- server side will have to automatically log this in
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  casualty_no INT(11) NOT NULL,
  category VARCHAR(255) NOT NULL, -- based on type of assistance required: RTA, FIRE_EMERGENCY, MED_EMERGENCY, GAS_LEAK_CTRL
  description VARCHAR(255) NOT NULL,
  status VARCHAR(255) DEFAULT 'NEW',
  op_create_id INT(11) NOT NULL, -- server side will have to automatically log this in
  op_update_id INT(11) DEFAULT NULL, -- server side will have to automatically log this in
  FOREIGN KEY (op_create_id) REFERENCES staff(id),
  FOREIGN KEY (op_update_id) REFERENCES staff(id),
  PRIMARY KEY (id)
);

CREATE TABLE `vehicle_incident` (
  id INT(11) NOT NULL,
  plate_number VARCHAR(255) NOT NULL,
  PRIMARY KEY (id, plate_number),
  FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number),
  FOREIGN KEY (id) REFERENCES incidents(id)
);

CREATE TABLE `road_traffic_acc` (
  id INT(11) NOT NULL,
  vehicle_type VARCHAR(255) NOT NULL,
  vehicle_plate VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES incidents(id)
);

CREATE TABLE `fire_emergency` (
  id INT(11) NOT NULL,
  fire_spread_rate INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES incidents(id)
);

CREATE TABLE `med_emergency` (
  id INT(11) NOT NULL,
  cause_description VARCHAR(255) NOT NULL,
  cause VARCHAR(255) NOT NULL,
  curr_condition VARCHAR(255) NOT NULL,
  level_of_consc VARCHAR(255) NOT NULL,
  if_suicide boolean NOT NULL DEFAULT FALSE,
  suicidal_equipment VARCHAR(255) DEFAULT NULL, -- Optional field
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES incidents(id)
);

CREATE TABLE `civil_emergency` (
  id INT(11) NOT NULL,
  supp_doc_dir VARCHAR(255) DEFAULT NULL, -- Link to the uploaded supplement document
  ce_handle_id INT(11) NOT NULL,
  ce_upload_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES incidents(id),
  FOREIGN KEY (ce_handle_id) REFERENCES staff(id), -- specialist
  FOREIGN KEY (ce_upload_id) REFERENCES staff(id) -- specialist
);

CREATE TABLE `hospital` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  ownership VARCHAR(255) NOT NULL,
  postal_code INT(11) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(17,14) NOT NULL,
  lng DECIMAL(17,14) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `inc_casualty` (
  nric INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  race VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  curr_condition VARCHAR(255) NOT NULL,
  allergy VARCHAR(255) NOT NULL DEFAULT 'NIL',
  level_of_consc VARCHAR(255) NOT NULL,
  medical_history VARCHAR(255) NOT NULL DEFAULT 'NIL',
  hospital_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (nric, incident_id, hospital_id),
  FOREIGN KEY (hospital_id) REFERENCES hospital(id),
  FOREIGN KEY (incident_id) REFERENCES incidents(id)
);

CREATE TABLE `email_directory` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  organisation VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `email_log` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  creater_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(id),
  FOREIGN KEY (creater_id) REFERENCES staff(id), -- relations officer
  FOREIGN KEY (email_id) REFERENCES email_directory(id) 
);

CREATE TABLE `sms_directory` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact_no INT(11) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `sms_log` (
  id INT(11) NOT NULL AUTO_INCREMENT, 
  creater_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sms_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(id),
  FOREIGN KEY (creater_id) REFERENCES staff(id), -- relations_officer
  FOREIGN KEY (sms_id) REFERENCES sms_directory(id) 
);

CREATE TABLE `social_media_log` (
  id INT(11) NOT NULL AUTO_INCREMENT, 
  send_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  staff_id INT(11) NOT NULL,
  incident_id INT(11) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (staff_id) REFERENCES staff(id), -- relations_officer
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(id),
  FOREIGN KEY (incident_id) REFERENCES civil_emergency(id)
);


/*Dummy Values Insert*/
/*`role` table*/
INSERT INTO `role` (`name`) VALUES ('Ops Center Manager');
INSERT INTO `role` (`name`) VALUES ('Ops Center Operator');
INSERT INTO `role` (`name`) VALUES ('Ops Ground Commander');
INSERT INTO `role` (`name`) VALUES ('Specialist');
INSERT INTO `role` (`name`) VALUES ('Relations Officer');

/*`policy` table*/
INSERT INTO `policy` (role_id, name) VALUES (1, 'CREATE_INCIDENT'); -- Manager
INSERT INTO `policy` (role_id, name) VALUES (1, 'UPDATE_INCIDENT'); -- Manager, incident.category != 'Civil Emergency'
INSERT INTO `policy` (role_id, name) VALUES (1, 'VIEW_INCIDENT'); -- Manager
INSERT INTO `policy` (role_id, name) VALUES (2, 'CREATE_INCIDENT'); -- Operator
INSERT INTO `policy` (role_id, name) VALUES (2, 'UPDATE_INCIDENT'); -- Operator, incident.category != 'Civil Emergency'
INSERT INTO `policy` (role_id, name) VALUES (2, 'VIEW_INCIDENT'); -- Operator
/*
====================================
List of possible values for policy: |
CREATE_INCIDENT						|
UPDATE_INCIDENT						|
VIEW_INCIDENT						|
GENERATE_REPORT						|
REQUEST_ASSIST						|
FULFIL_ASSIST						|
SEARCH_INCIDENT						|
ESCALATE_INCIDENT					|
VIEW_CE_INCIDENT					|
UPDATE_CE_INCIDENT					|
ALERT_EXT_SVC						|
UPDATE_SOCIAL_MEDIA					|
SMS_GEN_PUBLIC						|
SMS_GEN_PUBLIC						|
====================================
*/

/*`hospital` table*/
INSERT INTO `hospital` (`name`, `ownership`, `postal_code`, `address`, `lat`, `lng`) VALUES('Alexandra Hospital', 'public', 159964, '378 Alexandra Rd', 1.286464,103.799584);
INSERT INTO `hospital` (`name`, `ownership`, `postal_code`, `address`, `lat`, `lng`) VALUES('Changi General Hospital', 'public', 529889, '2 Simei Street 3', 1.34123,103.948109);
INSERT INTO `hospital` (`name`, `ownership`, `postal_code`, `address`, `lat`, `lng`) VALUES('Ng Teng Fong General Hospital', 'public', 609606, '1 Jurong East Street 21', 1.333605,103.745449);
INSERT INTO `hospital` (`name`, `ownership`, `postal_code`, `address`, `lat`, `lng`) VALUES('Raffles Hospital', 'private', 188770, '585 North Bridge Rd', 1.301169,103.857214);
INSERT INTO `hospital` (`name`, `ownership`, `postal_code`, `address`, `lat`, `lng`) VALUES('Mount Elizabeth Hospital', 'private', 228510, '3 Mount Elizabeth', 1.305372,103.83577);

/*`fire_station` table*/
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Central Fire Station', 179367,'62 Hill Street Singapore 179367',1.29207215544204,103.848816356736);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Alexandra Fire Station', 149073,'3 Queensway Singapore 149073',1.28842658313762,103.802829530355);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Clementi Fire Station', 129577,'Commonwealth Ave West (off Clementi Service Road) Singapore 129577',1.32188264376201,103.761667058382);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Bishan Fire Station', 574029,'1 Marymount Lane Singapore 574029',1.34793549822619,103.838688571274);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Jurong Island Fire Station', 627880,'70 Jurong Island Highway, Jurong Island Singapore 627880',1.27192930229366,103.708204579063);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Banyan Fire Station', 627642,'15 Banyan Road, Jurong Island Singapore 627642',1.25425146849741,103.674022552961);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Tampines Fire Station', 528777,'1 Tampines Industrial Avenue 3 #01-01 Singapore 528777',1.35800487837545,103.929375310223);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Paya Lebar Fire Station', 408827,'91 Ubi Avenue 4 Singapore 408827',1.33422118542586,103.893109559994);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Changi Fire Station', 486965,'491 Upper Changi road Singapore 486965',1.33486863424549,103.951334218391);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Yishun Fire Station', 768774,'533 Yishun Industrial Park A #01-01 Singapore 768774',1.44416046310858,103.836857015109);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Ang Mo Kio Fire Station', 569783,'2874 Ang Mo Kio Avenue 9 Singapore 569783',1.38498785131232,103.845627328032);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Sengkang Fire Station', 545064,'50 Buangkok Drive Singapore 545064',1.38029529813116,103.895445388999);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Jurong Fire Station', 649922,'25 Boon Lay Drive Singapore 649922',1.34178379944597,103.710978968019);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Tuas Fire Station', 638483,'7 Tuas Road Singapore 638483',1.31966262072274,103.661318368606);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Woodlands Fire Station', 738782,'1 Woodlands Industrial Park D Street 2 Singapore 738782',1.43078793517284,103.762361868443);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Bukit Batok Fire Station', 658072,'80 Bukit Batok Road Singapore 658072',1.37334064853695,103.752802046757);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('West Coast Marine Fire Station', 126979,'60 Westcoast Ferry Road Singapore 126979',1.29250761408546,103.762061688759);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Marina Bay Fire Station', 018962,'70 Marina View Singapore 018962',1.27473550025562,103.848994264171);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Tuas View Fire Station', 637367,'130 Tuas South Ave 3',1.28897280676036,103.627508649074);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Brani Marine Fire Station', 098002,'19 Brani Way',1.25663908046912,103.838710441094);
INSERT INTO `fire_station` (`name`, `postal_code`, `address`, `lat`, `lng`) VALUES('Sentosa Fire Station', 099957,'37 Artillery Avenue Singapore 099957',1.25070706197001,103.827511673018);

/*`vehicle` table*/
/*Basic Task Force*/
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0111S','A011',1,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0121S','A012',1,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0111S','PA011',1,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0121S','PA012',1,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0111S','FB011',1,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0121S','FB012',1,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0131S','FB013',1,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0111S','PL011',1,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0121S','PL012',1,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0131S','PL013',1,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0414S','A041',4,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0424S','A042',4,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0414S','PA041',4,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0424S','PA042',4,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0414S','FB041',4,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0424S','FB042',4,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0434S','FB043',4,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0414S','PL041',4,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0424S','PL042',4,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0434S','PL043',4,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0717S','A071',7,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA0727S','A072',7,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0717S','PA071',7,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA0727S','PA072',7,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0717S','FB071',7,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0727S','FB072',7,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB0737S','FB073',7,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0717S','PL071',7,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0727S','PL072',7,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL0737S','PL073',7,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1313S','A131',13,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1323S','A132',13,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1313S','PA131',13,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1323S','PA132',13,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1313S','FB131',13,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1323S','FB132',13,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1333S','FB133',13,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1313S','PL131',13,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1323S','PL132',13,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1333S','PL133',13,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1515S','A151',15,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1525S','A152',15,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1515S','PA151',15,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1525S','PA152',15,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1515S','FB151',15,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1525S','FB152',15,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1535S','FB153',15,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1515S','PL151',15,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1525S','PL152',15,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1535S','PL153',15,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1919S','A191',19,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CMA1929S','A192',19,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1919S','PA191',19,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPA1929S','PA192',19,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1919S','FB191',19,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1929S','FB192',19,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CFB1939S','FB193',19,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1919S','PL191',19,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1929S','PL192',19,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('BPL1939S','PL193',19,'Pump Ladder',FALSE);

/*Advanced Task Force*/
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('ASW0111S','SW011',1,'SWIFT',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPL0111S','CPL011',1,'Combined Platform-Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPL0121S','CPL012',1,'Combined Platform-Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HRT0111S','HRT011',1,'Heavy Rescue Tender',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HMV0111S','HMV011',1,'Hazmat Mitigation Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HMV0121S','HMV012',1,'Hazmat Mitigation Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('PDV0111S','PDV011',1,'Personnel Decontamination Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('PDV0121S','PDV012',1,'Personnel Decontamination Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('ACV0111S','CV011',1,'Command Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('ASW1919S','SW191',19,'SWIFT',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPL1919S','CPL191',19,'Combined Platform-Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('CPL1929S','CPL192',19,'Combined Platform-Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HRT1919S','HRT191',19,'Heavy Rescue Tender',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HMV1919S','HMV191',19,'Hazmat Mitigation Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('HMV1929S','HMV192',19,'Hazmat Mitigation Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('PDV1919S','PDV191',19,'Personnel Decontamination Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('PDV1929S','PDV192',19,'Personnel Decontamination Vehicle',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('ACV1919S','CV191',19,'Command Vehicle',FALSE);

/*`sms_directory` table*/
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Bin','97683293');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Boon','91156263');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Hans','93852408');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('James','91295545');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Joshen','81273302');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Jun Xiong','96723705');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Kam Wai','97519728');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Salleh','96554936');
INSERT INTO `sms_directory` (`name`, `contact_no`) VALUES('Wan Qi','98906997');

/*`email_directory` table*/
INSERT INTO `email_directory` (`name`, `email_address`, `organisation`) VALUES ('Ministry of Home Affairs','mha_alert@gov.sg','Ministry');
INSERT INTO `email_directory` (`name`, `email_address`, `organisation`) VALUES ('Ministry of Health','moh_alert@gov.sg','Ministry');
INSERT INTO `email_directory` (`name`, `email_address`, `organisation`) VALUES ('Ministry of Defence','mod_alert@gov.sg','Ministry');
INSERT INTO `email_directory` (`name`, `email_address`, `organisation`) VALUES ('Ministry of Foreign Affairs','mfa_alert@gov.sg','Ministry');
INSERT INTO `email_directory` (`name`, `email_address`, `organisation`) VALUES ('Ministry of Transport','mot_alert@gov.sg','Ministry');
