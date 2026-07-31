PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS provinces;

CREATE TABLE provinces (
    province_id TEXT PRIMARY KEY,
    province_name TEXT NOT NULL UNIQUE
);

CREATE TABLE patients (
    patient_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
    birth_date TEXT NOT NULL,
    city TEXT NOT NULL,
    province_id TEXT NOT NULL,
    allergies TEXT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(province_id)
);

INSERT INTO provinces (province_id, province_name) VALUES
    ('ON', 'Ontario'),
    ('NS', 'Nova Scotia'),
    ('BC', 'British Columbia'),
    ('QC', 'Quebec');

INSERT INTO patients (
    patient_id, first_name, last_name, gender, birth_date, city,
    province_id, allergies, height, weight
) VALUES
    (1, 'John',   'Smith',  'M', '1980-05-10', 'Toronto',  'ON', NULL,         180, 82),
    (2, 'Alice',  'Carter', 'F', '1992-02-14', 'Halifax',  'NS', 'Penicillin', 165, 100),
    (3, 'Carlos', 'Diaz',   'M', '1975-07-01', 'Montreal', 'QC', NULL,         172, 120),
    (4, 'Chloe',  'Martin', 'F', '2001-11-22', 'Ottawa',   'ON', '',           160, 99),
    (5, 'Bob',    'Stone',  'M', '1968-04-03', 'Vancouver','BC', 'Morphine',   175, 121),
    (6, 'Clara',  'Oswald', 'F', '1988-12-12', 'Sydney',   'NS', NULL,         168, 110),
    (7, 'Cedric', 'Hall',   'M', '2010-01-15', 'Kingston', 'ON', 'Dust',       140, 45),
    (8, 'Eva',    'Green',  'F', '1979-09-09', 'Quebec',   'QC', NULL,         158, 70);
