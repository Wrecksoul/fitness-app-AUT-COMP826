MERGE INTO users (username, password)
KEY (username)
VALUES ('alice', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');
MERGE INTO users (username, password)
KEY (username)
VALUES ('bob', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');
MERGE INTO users (username, password)
KEY (username)
VALUES ('charlie', '$2a$10$VtK3QLtPGwWS2ZiJ9fyM6.aQJhXpjGwf.okAjzcouqJonmJOVisdm');

MERGE INTO routes (id, name, description, distance_km)
KEY (id)
VALUES (1, 'City Explorer', 'Explore the downtown area and check in at key spots.', 3.5);

MERGE INTO routes (id, name, description, distance_km)
KEY (id)
VALUES (2, 'Harbour Run', 'Run along the beautiful Auckland Harbour.', 5.2);

MERGE INTO route_checkpoints (id, route_id, sequence_order, latitude, longitude)
KEY (id)
VALUES (1, 1, 1, -36.8485, 174.7633);

MERGE INTO route_checkpoints (id, route_id, sequence_order, latitude, longitude)
KEY (id)
VALUES (2, 1, 2, -36.8500, 174.7650);

MERGE INTO route_checkpoints (id, route_id, sequence_order, latitude, longitude)
KEY (id)
VALUES (3, 2, 1, -36.8467, 174.7700);

MERGE INTO route_checkpoints (id, route_id, sequence_order, latitude, longitude)
KEY (id)
VALUES (4, 2, 2, -36.8450, 174.7750);
