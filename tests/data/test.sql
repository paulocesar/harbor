DROP DATABASE IF EXISTS harbortest;
CREATE DATABASE harbortest;
USE harbortest;

CREATE TABLE npm (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

INSERT INTO npm (name, url, description) VALUES
    ('harbor', 'https://github.com/paulocesar/harbor.git', 'MVC'),
    ('horizon', 'https://github.com/paulocesar/horizon.git', NULL);
