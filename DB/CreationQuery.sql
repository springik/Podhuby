CREATE OR REPLACE DATABASE podhubydb;
use podhubydb;
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email varchar(32) UNIQUE KEY NOT NULL,
    nickname varchar(32) UNIQUE KEY NOT NULL,
    password varchar(64) NOT NULL,
    pfpPath varchar(16)
);