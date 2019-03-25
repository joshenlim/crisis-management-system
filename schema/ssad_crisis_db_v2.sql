ALTER TABLE `vehicle_incident` CHANGE `id` `incident_id` INT(11) NOT NULL;
ALTER TABLE `vehicle_incident` DROP FOREIGN KEY vehicle_incident_ibfk_2; 
ALTER TABLE `vehicle_incident` ADD FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`);