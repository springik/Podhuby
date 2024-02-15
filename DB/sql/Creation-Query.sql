CREATE DATABASE IF NOT EXISTS podhubydb;
use podhubydb;

CREATE TABLE IF NOT EXISTS users(
	id SERIAL PRIMARY KEY,
	email varchar(32) NOT NULL UNIQUE,
	nickname varchar(32) NOT NULL UNIQUE,
	password varchar(64) NOT NULL,
	pfpPath varchar(16) DEFAULT 'default_podcast_image.png'
);

CREATE TABLE IF NOT EXISTS sessions(
	session_id varchar(128) NOT NULL PRIMARY KEY,
	expires TIMESTAMP(3) NOT NULL,
	data json
);

CREATE TABLE IF NOT EXISTS genres(
	genre_id SERIAL PRIMARY KEY,
	name varchar(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS podcasts(
	podcast_id SERIAL PRIMARY KEY,
	title varchar(48) NOT NULL,
	description text NOT NULL,
	links text[] NOT NULL,
	imagePath varchar(32) NOT NULL DEFAULT 'default_podcast_image.png',
	genre_id int,
	CONSTRAINT fk_genre
		FOREIGN KEY(genre_id)
			REFERENCES 	genres(genre_id)
);

CREATE TABLE IF NOT EXISTS tags(
	tag_id SERIAL PRIMARY KEY,
	name varchar(32)
);

CREATE TABLE podcasts_has_tags(
	podcast_id int NOT NULL,
	tag_id int NOT NULL,
	CONSTRAINT fk_podcast
		FOREIGN KEY(podcast_id)
			REFERENCES podcasts(podcast_id),
	CONSTRAINT fk_tag
		FOREIGN KEY(tag_id)
			REFERENCES tags(tag_id)
);

CREATE TABLE IF NOT EXISTS user_favourite_podcast(
	podcast_id int NOT NULL,
	user_id int NOT NULL,
	CONSTRAINT fk_podcast
		FOREIGN KEY(podcast_id)
			REFERENCES podcasts(podcast_id),
	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
			REFERENCES users(id)
);