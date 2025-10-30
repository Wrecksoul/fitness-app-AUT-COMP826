MERGE INTO users (username, password)
KEY (username)
VALUES ('alice', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');
MERGE INTO users (username, password)
KEY (username)
VALUES ('bob', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');
MERGE INTO users (username, password)
KEY (username)
VALUES ('charlie', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');