ALTER TABLE `med_emergency` DROP `cause`;
ALTER TABLE `med_emergency` DROP `cause_description`;
ALTER TABLE `med_emergency` ADD `sucidal_method` VARCHAR(255);

ALTER TABLE `incidents` DROP `call_time`;
ALTER TABLE `incidents` ALTER `status` DROP DEFAULT;
ALTER TABLE `incidents` ALTER `status` SET DEFAULT 'DISPATCHED';

ALTER TABLE `vehicle_incident` ADD `veh_status` VARCHAR(255) NOT NULL;

ALTER TABLE `fire_emergency` CHANGE `id` `incident_id` INT(11) NOT NULL;
ALTER TABLE `med_emergency` CHANGE `id` `incident_id` INT(11) NOT NULL;
ALTER TABLE `road_traffic_acc` CHANGE `id` `incident_id` INT(11) NOT NULL;
