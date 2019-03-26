ALTER TABLE `med_emergency` DROP `cause`;
ALTER TABLE `med_emergency` DROP `cause_description`;
ALTER TABLE `med_emergency` ADD `sucidal_method` VARCHAR(255);

ALTER TABLE `incidents` DROP `call_time`;
ALTER TABLE `incidents` ALTER `status` DROP DEFAULT;
ALTER TABLE `incidents` ALTER `status` SET DEFAULT 'DISPATCHED';

ALTER TABLE `vehicle_incident` ADD `veh_status` VARCHAR(255) NOT NULL;

