CREATE DATABASE IF NOT EXISTS bit_track_bdd
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bit_track_bdd;

CREATE TABLE hospitales (
  id_hospital INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  ciudad      VARCHAR(80)  NOT NULL
);

INSERT INTO hospitales (nombre, ciudad) VALUES
  ('Hospital Italiano', 'Buenos Aires'),
  ('Hospital Austral', 'Buenos Aires'),
  ('Hospital Italiano', 'Buenos Aires'),
  ('Hospital Clinica Jose de San Martin', 'Buenos Aires'),
  ('Hospital Hospital Britanico de Buenos Aires', 'Buenos Aires');
  

CREATE TABLE robots (
  id_robot     INT AUTO_INCREMENT PRIMARY KEY,
  codigo       VARCHAR(30) NOT NULL UNIQUE, 
  modelo       VARCHAR(80) NOT NULL,
  disponible   BOOLEAN NOT NULL DEFAULT TRUE,
  fk_hospital  INT NOT NULL,

  CONSTRAINT fk_robot_hospital FOREIGN KEY (fk_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT
);

INSERT INTO robots (codigo, modelo, fk_hospital) VALUES
  ('ROB-001', 'Rover01', 1),
  ('ROB-002', 'Rover02', 1),
  ('ROB-003', 'Rover03', 2),
  ('ROB-004', 'Rover04', 3),
  ('ROB-005', 'Rover05', 4),
  ('ROB-006', 'Rover06', 5);

CREATE TABLE usuarios (
  id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(80)  NOT NULL,
  email        VARCHAR(120) NOT NULL UNIQUE,
  contrasena   VARCHAR(255) NOT NULL, 
  fk_hospital  INT NOT NULL,
  fk_robot     INT NULL,

  CONSTRAINT fk_usuario_hospital FOREIGN KEY (fk_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT,
  CONSTRAINT fk_usuario_robot FOREIGN KEY (fk_robot)
    REFERENCES robots(id_robot) ON DELETE SET NULL
);