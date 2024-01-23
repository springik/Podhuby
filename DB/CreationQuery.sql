-- DB creation
CREATE DATABASE IF NOT EXISTS podhubydb;
use podhubydb;
-- Table Creation

-- user table creation query
-- stores a user
CREATE TABLE IF NOT EXISTS `users`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` varchar(32) UNIQUE KEY NOT NULL,
    `nickname` varchar(32) UNIQUE KEY NOT NULL,
    `password` varchar(64) NOT NULL,
    `pfpPath` varchar(32) DEFAULT 'default_podcast_image.png'
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
    `title` varchar(48) NOT NULL,
    `description` TEXT NOT NULL,
    `link1` varchar(32) NOT NULL,
    `link2` varchar(32),
    `link3` varchar(32),
    `imagePath` varchar(32) NOT NULL DEFAULT 'default_podcast_image.png',
    `genre_id` INT NOT NULL,
    CONSTRAINT FK_podcast_genre FOREIGN KEY (genre_id)
    REFERENCES genres(genre_id)
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
-- user favourite podcast join table creation
CREATE TABLE IF NOT EXISTS `user_favourite_podcast`(
    podcast_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT FK_favourite_join_podcast FOREIGN KEY (podcast_id)
    REFERENCES podcasts(podcast_id),
    CONSTRAINT FK_favourite_join_user FOREIGN KEY (user_id)
    REFERENCES users(id)
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
