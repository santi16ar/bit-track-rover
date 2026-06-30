CREATE DATABASE IF NOT EXISTS hospital_robots_simple
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital_robots_simple;

CREATE TABLE hospitales (
  id_hospital INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  ciudad      VARCHAR(80)  NOT NULL
);

INSERT INTO hospitales (nombre, ciudad) VALUES
  ('Hospital Italiano', 'Buenos Aires'),
  ('Hospital Austral', 'Pilar');

CREATE TABLE robots (
  id_robot     INT AUTO_INCREMENT PRIMARY KEY,
  codigo       VARCHAR(30) NOT NULL UNIQUE,   -- ej: ROB-001
  modelo       VARCHAR(80) NOT NULL,
  disponible   BOOLEAN NOT NULL DEFAULT TRUE,
  fk_hospital  INT NOT NULL,

  CONSTRAINT fk_robot_hospital FOREIGN KEY (fk_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT
);

INSERT INTO robots (codigo, modelo, fk_hospital) VALUES
  ('ROB-001', 'MedBot X1', 1),
  ('ROB-002', 'MedBot X1', 1),
  ('ROB-003', 'MedBot X2', 2);

CREATE TABLE usuarios (
  id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(80)  NOT NULL,
  email        VARCHAR(120) NOT NULL UNIQUE,
  contrasena   VARCHAR(255) NOT NULL,   -- hasheada con bcrypt
  fk_hospital  INT NOT NULL,
  fk_robot     INT NULL,

  CONSTRAINT fk_usuario_hospital FOREIGN KEY (fk_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT,
  CONSTRAINT fk_usuario_robot FOREIGN KEY (fk_robot)
    REFERENCES robots(id_robot) ON DELETE SET NULL
);