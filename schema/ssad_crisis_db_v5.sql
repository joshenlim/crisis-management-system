CREATE TABLE `external_service`(
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  contact_num VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE `alert_log` (
  id INT(11) NOT NULL AUTO_INCREMENT,
  ce_id INT(11) NOT NULL,
  ext_svc_id INT (11) NOT NULL,
  if_alerted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ce_id) REFERENCES civil_emergency(incident_id),
  FOREIGN KEY (ext_svc_id) REFERENCES external_service(id),
  PRIMARY KEY (id)
);


INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Red Cross House','First Aid','66640500');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('St. John Singapore','First Aid','62980300');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Life Saver Singapore','First Aid','61297492');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Samaritans Hero','First Aid','61272110');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Singapore Press Holdings','Media Coverage','63196319');
