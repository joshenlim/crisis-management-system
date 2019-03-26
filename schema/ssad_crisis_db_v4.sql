ALTER TABLE `med_emergency` CHANGE `sucidal_method` `suicidal_method` VARCHAR(255);
ALTER TABLE `civil_emergency` CHANGE `id` `incident_id` INT(11) NOT NULL;

ALTER TABLE `fire_station_gc` ADD `veh_plate_num` VARCHAR(255) NOT NULL; -- GC is always tied to a vehicle
ALTER TABLE `fire_station_gc` ADD FOREIGN KEY (`veh_plate_num`) REFERENCES `vehicle`(`plate_number`);

ALTER TABLE `fire_station_gc` CHANGE `id` `staff_id` INT(11) NOT NULL;

ALTER TABLE `incidents` ADD `if_escalate_hq` BOOLEAN DEFAULT FALSE;