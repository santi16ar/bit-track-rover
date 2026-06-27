-- ============================================
-- BASE DE DATOS: Sistema de Robots Hospitalarios
-- Motor: MySQL / MariaDB
-- ============================================

CREATE DATABASE IF NOT EXISTS hospital_robots
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital_robots;

-- --------------------------------------------
-- TABLA: roles
-- --------------------------------------------
CREATE TABLE roles (
  id_rol      INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol  VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nombre_rol) VALUES
  ('admin'),
  ('medico'),
  ('enfermero'),
  ('tecnico');

-- --------------------------------------------
-- TABLA: hospitales
-- --------------------------------------------
CREATE TABLE hospitales (
  id_hospital  INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL,
  direccion    VARCHAR(150) NOT NULL,
  ciudad       VARCHAR(80)  NOT NULL,
  pais         VARCHAR(80)  NOT NULL DEFAULT 'Argentina'
);

INSERT INTO hospitales (nombre, direccion, ciudad, pais) VALUES
  ('Hospital Italiano', 'Av. Potosí 4247', 'Buenos Aires', 'Argentina'),
  ('Hospital Austral',  'Av. Juan D. Perón 1500', 'Pilar', 'Argentina');

-- --------------------------------------------
-- TABLA: usuarios
-- --------------------------------------------
CREATE TABLE usuarios (
  id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(80)  NOT NULL,
  apellido       VARCHAR(80)  NOT NULL,
  email          VARCHAR(120) NOT NULL UNIQUE,
  contrasena     VARCHAR(255) NOT NULL,        -- guardar siempre hasheada (bcrypt)
  fk_id_hospital INT NOT NULL,
  fk_rol         INT NOT NULL DEFAULT 3,       -- enfermero por defecto
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_usuario_hospital FOREIGN KEY (fk_id_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_usuario_rol FOREIGN KEY (fk_rol)
    REFERENCES roles(id_rol) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- --------------------------------------------
-- TABLA: robots
-- --------------------------------------------
CREATE TABLE robots (
  id_robot       INT AUTO_INCREMENT PRIMARY KEY,
  cod_robot      VARCHAR(30)  NOT NULL UNIQUE,
  modelo         VARCHAR(80)  NOT NULL,
  estado         ENUM('activo','inactivo','cargando','mantenimiento') NOT NULL DEFAULT 'inactivo',
  bateria        TINYINT UNSIGNED NOT NULL DEFAULT 100 CHECK (bateria BETWEEN 0 AND 100),
  fk_id_hospital INT NOT NULL,
  creado_en      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_robot_hospital FOREIGN KEY (fk_id_hospital)
    REFERENCES hospitales(id_hospital) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO robots (cod_robot, modelo, estado, bateria, fk_id_hospital) VALUES
  ('ROB-001', 'MedBot X1', 'activo',   92, 1),
  ('ROB-002', 'MedBot X1', 'cargando', 45, 1),
  ('ROB-003', 'MedBot X2', 'activo',   78, 2);

-- --------------------------------------------
-- TABLA: llamadas
-- Registro de cada vez que un usuario llama a un robot
-- --------------------------------------------
CREATE TABLE llamadas (
  id_llamada     INT AUTO_INCREMENT PRIMARY KEY,
  fk_id_usuario  INT NOT NULL,
  fk_id_robot    INT NOT NULL,
  origen         VARCHAR(100) NOT NULL,   -- ej: "Sala 3 - Piso 2"
  destino        VARCHAR(100) NOT NULL,   -- ej: "Farmacia"
  tipo_servicio  VARCHAR(80)  NOT NULL,   -- ej: "medicamento", "traslado"
  fecha_hora     DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_llamada_usuario FOREIGN KEY (fk_id_usuario)
    REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_llamada_robot FOREIGN KEY (fk_id_robot)
    REFERENCES robots(id_robot) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices para búsquedas frecuentes por fecha y robot
CREATE INDEX idx_llamadas_robot   ON llamadas(fk_id_robot);
CREATE INDEX idx_llamadas_usuario ON llamadas(fk_id_usuario);
CREATE INDEX idx_llamadas_fecha   ON llamadas(fecha_hora);

-- --------------------------------------------
-- TABLA: comandos
-- Instrucciones de movimiento o acción enviadas al robot
-- --------------------------------------------
CREATE TABLE comandos (
  id_comando     INT AUTO_INCREMENT PRIMARY KEY,
  fk_id_usuario  INT NOT NULL,
  fk_id_robot    INT NOT NULL,
  direccion      VARCHAR(50)  NOT NULL,   -- ej: "norte", "sala_5", coordenadas
  descripcion    VARCHAR(200),
  fecha_hora     DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comando_usuario FOREIGN KEY (fk_id_usuario)
    REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_comando_robot FOREIGN KEY (fk_id_robot)
    REFERENCES robots(id_robot) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_comandos_robot ON comandos(fk_id_robot);

-- --------------------------------------------
-- TABLA: notificaciones
-- Alertas generadas por el robot (batería baja, error, etc.)
-- --------------------------------------------
CREATE TABLE notificaciones (
  id_notif      INT AUTO_INCREMENT PRIMARY KEY,
  fk_id_robot   INT NOT NULL,
  tipo          ENUM('bateria_baja','error','mantenimiento','info') NOT NULL DEFAULT 'info',
  mensaje       VARCHAR(255) NOT NULL,
  leido         BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_hora    DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notif_robot FOREIGN KEY (fk_id_robot)
    REFERENCES robots(id_robot) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_notif_robot ON notificaciones(fk_id_robot);
CREATE INDEX idx_notif_leido ON notificaciones(leido);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: robots con nombre de hospital
CREATE VIEW v_robots AS
  SELECT
    r.id_robot,
    r.cod_robot,
    r.modelo,
    r.estado,
    r.bateria,
    h.nombre  AS hospital,
    h.ciudad
  FROM robots r
  JOIN hospitales h ON r.fk_id_hospital = h.id_hospital;

-- Vista: historial de llamadas con nombres
CREATE VIEW v_llamadas AS
  SELECT
    l.id_llamada,
    CONCAT(u.nombre, ' ', u.apellido) AS usuario,
    r.cod_robot,
    r.modelo,
    l.origen,
    l.destino,
    l.tipo_servicio,
    l.fecha_hora
  FROM llamadas l
  JOIN usuarios u ON l.fk_id_usuario = u.id_usuario
  JOIN robots   r ON l.fk_id_robot   = r.id_robot;

-- Vista: notificaciones no leídas con info del robot
CREATE VIEW v_notificaciones_pendientes AS
  SELECT
    n.id_notif,
    r.cod_robot,
    h.nombre AS hospital,
    n.tipo,
    n.mensaje,
    n.fecha_hora
  FROM notificaciones n
  JOIN robots     r ON n.fk_id_robot    = r.id_robot
  JOIN hospitales h ON r.fk_id_hospital = h.id_hospital
  WHERE n.leido = FALSE
  ORDER BY n.fecha_hora DESC;