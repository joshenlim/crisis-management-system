CREATE TABLE `ce_desc_log`(
  id INT(11) NOT NULL AUTO_INCREMENT,
  specialist_id INT(11) NOT NULL,
  ce_incident_id INT(11) NOT NULL,
  description LONGTEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  if_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id),
  FOREIGN KEY (specialist_id) REFERENCES staff(id),
  FOREIGN KEY (ce_incident_id) REFERENCES civil_emergency(incident_id)
);


ALTER TABLE `incidents` ADD `if_alerted` BOOLEAN DEFAULT FALSE; -- If alerted SPF for crowd control
ALTER TABLE `road_traffic_acc` ADD `if_alerted` BOOLEAN DEFAULT FALSE; -- If alerted LTA for traffic control

INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MBA1811S','A181',18,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MBA1822S','A182',18,'Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MPA1813S','PA181',18,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MPA1824S','PA182',18,'Private Ambulance',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MFB1815S','FB181',18,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MFB1826S','FB182',18,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MFB1837S','FB183',18,'Fire Bike',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MPL1818S','PL181',18,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MPL1829S','PL182',18,'Pump Ladder',FALSE);
INSERT INTO `vehicle` (`plate_number`, `call_sign`, `fire_station_id`, `type`, `on_off_call`) VALUES('MPL1830S','PL183',18,'Pump Ladder',FALSE);


INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Alexandra Hospital','Public Hospital','64722000');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Changi General Hospital','Public Hospital','67888833');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Ng Teng Fong General Hospital','Public Hospital','67166750');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Raffles Hospital','Private Hospital','63111555');
INSERT INTO `external_service` (`name`, `category`, `contact_num`) VALUES('Mount Elizabeth Hospital','Private Hospital','67312218');
