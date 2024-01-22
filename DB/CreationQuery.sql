CREATE OR REPLACE DATABASE podhubydb;
use podhubydb;
-- Table Creation

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
	`session_id` varchar(128) NOT NULL PRIMARY KEY,
    `expires` TIMESTAMP(3) NOT NULL,
    `data` MEDIUMTEXT COLLATE utf8mb4_bin
);
-- podcast table creation
-- used to store podcasts
CREATE TABLE IF NOT EXISTS `podcasts`(
    `podcast_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `link1` varchar(32) NOT NULL,
    `link2` varchar(32),
    `link3` varchar(32),
    `imagePath` varchar(16) NOT NULL
);
-- genre table creation
-- used to store genres
CREATE TABLE IF NOT EXISTS `genres`(
    `genre_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(32) NOT NULL
);
-- tag table creation
-- used to store tags
CREATE TABLE IF NOT EXISTS `tags`(
    `tag_id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` varchar(32)
);

-- Join tables creation

-- podcasts <-> tags join table creation
CREATE TABLE IF NOT EXISTS `podcasts_has_tags`(
    `podcast_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    CONSTRAINT  FK_podcast_join_tag FOREIGN KEY (podcast_id)
    REFERENCES podcasts(podcast_id),
    CONSTRAINT FK_tag_join FOREIGN KEY (tag_id)
    REFERENCES tags(tag_id)
);
-- podcasts <-> genres table creation
CREATE TABLE IF NOT EXISTS `podcasts_has_genres`(
    `genre_id` INT NOT NULL,
    `podcast_id` INT NOT NULL,
    CONSTRAINT FK_genre_join FOREIGN KEY (genre_id)
    REFERENCES genres(genre_id),
    CONSTRAINT FK_podcast_join_genre FOREIGN KEY (podcast_id)
    REFERENCES podcasts(podcast_id)
);

-- Procedure Creation

-- session cleanup
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS session_clean_up()
BEGIN
	DELETE FROM sessions
	WHERE expires < NOW();
END $$
DELIMITER ;

-- Event Creation

-- daily maintenance
CREATE EVENT IF NOT EXISTS daily_maintenance
ON SCHEDULE EVERY 1 DAY
DO
	CALL session_clean_up();
