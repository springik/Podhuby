CREATE OR REPLACE DATABASE podhubydb;
use podhubydb;
--Table Creation

-- user table creation query
-- stores a user
CREATE TABLE IF NOT EXISTS `users`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` varchar(32) UNIQUE KEY NOT NULL,
    `nickname` varchar(32) UNIQUE KEY NOT NULL,
    `password` varchar(64) NOT NULL,
    `pfpPath` varchar(16)
);
-- session table creation query
-- used to store session data
CREATE TABLE IF NOT EXISTS `sessions`(
	`session_id` varchar(128) NOT NULL,
    `expires` TIMESTAMP(3) NOT NULL,
    `data` MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY(`session_id`)
);

-- Procedure Creation

-- session cleanup
DELIMETER //
CREATE PROCEDURE IF NOT EXISTS session_clean_up()
BEGIN
	DELETE FROM sessions
	WHERE expires < NOW();
END //
DELIMETER ;

-- Event Creation

-- daily maintenance
CREATE EVENT IF NOT EXISTS daily_maintenance
ON SCHEDULE EVERY 1 DAY
DO
	CALL session_clean_up();
