-- Dump of Table: users
------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_logged_in` datetime DEFAULT NULL,
  `last_logged_out` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT INTO users (username, password, name, created_at, updated_at, last_logged_in, last_logged_out) VALUES ('admin', '$2a$08$dFh3GWn9xncbLncL4b2WC.QGf3ScRxvTkY0DQN3saq9bhZVVIgDbS', 'Admin', NOW(), NOW(), NOW(), NOW());


--  Dump of Table: schema_version
------------------------------------------------------------

DROP TABLE IF EXISTS `schema_version`;

CREATE TABLE `schema_version` (
  `version` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `schema_version` WRITE;

INSERT INTO `schema_version` (`version`)
VALUES
	(1.0);

UNLOCK TABLES;

-- UPDATE `schema_version` SET `version` = 1.1;