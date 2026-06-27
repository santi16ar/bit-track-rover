<?php
// ============================================
// api.php — API REST para hospital_robots
// ============================================

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // ← cambiá por tu usuario
define('DB_PASS', '');            // ← cambiá por tu contraseña
define('DB_NAME', 'hospital_robots');

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $pdo = new PDO(
      "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
      DB_USER, DB_PASS,
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
       PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
  }
  return $pdo;
}

function json_out($data, int $code = 200): void {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

$method   = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$id       = $_GET['id'] ?? null;
$body     = json_decode(file_get_contents('php://input'), true) ?? [];

try {
  $db = getDB();

  // --- LOGIN ---
  if ($resource === 'login' && $method === 'POST') {
    $email    = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) json_out(['ok'=>false,'error'=>'Email y contraseña requeridos'], 400);

    $s = $db->prepare("
      SELECT u.*, r.nombre_rol, h.nombre AS hospital, h.ciudad
      FROM usuarios u
      JOIN roles r      ON u.fk_rol        = r.id_rol
      JOIN hospitales h ON u.fk_id_hospital = h.id_hospital
      WHERE u.email = ?
    ");
    $s->execute([$email]);
    $user = $s->fetch();

    if (!$user || !password_verify($password, $user['contrasena'])) {
      json_out(['ok'=>false,'error'=>'Email o contraseña incorrectos'], 401);
    }

    unset($user['contrasena']);
    json_out(['ok'=>true, 'usuario'=>$user]);
  }

  // --- REGISTRO ---
  if ($resource === 'registro' && $method === 'POST') {
    $email      = trim($body['email'] ?? '');
    $password   = $body['password'] ?? '';
    $nombreCompleto = trim($body['nombre'] ?? '');
    $hospitalId = intval($body['fk_id_hospital'] ?? 0);
    $rovers     = intval($body['rovers'] ?? 1);

    $partes   = explode(' ', $nombreCompleto, 2);
    $nombre   = $partes[0];
    $apellido = $partes[1] ?? '';

    $rolInput = $body['fk_rol'] ?? 'enfermero';
    if (is_numeric($rolInput)) {
      $fk_rol = intval($rolInput);
    } else {
      $rs = $db->prepare("SELECT id_rol FROM roles WHERE nombre_rol = ?");
      $rs->execute([strtolower(trim($rolInput))]);
      $rolRow = $rs->fetch();
      $fk_rol = $rolRow ? $rolRow['id_rol'] : 3;
    }

    if (!$email || !$password || !$nombre || !$hospitalId)
      json_out(['ok'=>false,'error'=>'Completá todos los campos'], 400);

    $check = $db->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) json_out(['ok'=>false,'error'=>'Ya existe una cuenta con ese email'], 409);

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $ins  = $db->prepare("INSERT INTO usuarios (nombre,apellido,email,contrasena,fk_id_hospital,fk_rol) VALUES (?,?,?,?,?,?)");
    $ins->execute([$nombre, $apellido, $email, $hash, $hospitalId, $fk_rol]);
    $newId = $db->lastInsertId();

    $s = $db->prepare("
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, r.nombre_rol, h.nombre AS hospital, h.ciudad
      FROM usuarios u
      JOIN roles r ON u.fk_rol=r.id_rol
      JOIN hospitales h ON u.fk_id_hospital=h.id_hospital
      WHERE u.id_usuario = ?
    ");
    $s->execute([$newId]);
    json_out(['ok'=>true, 'usuario'=>$s->fetch()], 201);
  }

  // --- HOSPITALES ---
  if ($resource === 'hospitales') {
    if ($method === 'GET')
      json_out($db->query("SELECT * FROM hospitales ORDER BY nombre")->fetchAll());
    if ($method === 'POST') {
      $s = $db->prepare("INSERT INTO hospitales (nombre,direccion,ciudad,pais) VALUES (?,?,?,?)");
      $s->execute([$body['nombre'], $body['direccion'], $body['ciudad'], $body['pais'] ?? 'Argentina']);
      json_out(['id'=>$db->lastInsertId()], 201);
    }
  }

  // --- ROBOTS ---
  if ($resource === 'robots') {
    if ($method === 'GET') {
      $sql = $id ? "SELECT * FROM v_robots WHERE id_robot=?" : "SELECT * FROM v_robots ORDER BY hospital,cod_robot";
      $s = $db->prepare($sql); $s->execute($id ? [$id] : []);
      json_out($id ? ($s->fetch() ?: []) : $s->fetchAll());
    }
    if ($method === 'POST') {
      $s = $db->prepare("INSERT INTO robots (cod_robot,modelo,estado,bateria,fk_id_hospital) VALUES (?,?,?,?,?)");
      $s->execute([$body['cod_robot'],$body['modelo'],$body['estado']??'inactivo',$body['bateria']??100,$body['fk_id_hospital']]);
      json_out(['id'=>$db->lastInsertId()], 201);
    }
    if ($method === 'PUT' && $id) {
      $db->prepare("UPDATE robots SET estado=?,bateria=? WHERE id_robot=?")->execute([$body['estado'],$body['bateria'],$id]);
      json_out(['mensaje'=>'Robot actualizado']);
    }
  }

  // --- USUARIOS ---
  if ($resource === 'usuarios' && $method === 'GET') {
    json_out($db->query("SELECT u.id_usuario,u.nombre,u.apellido,u.email,r.nombre_rol,h.nombre AS hospital FROM usuarios u JOIN roles r ON u.fk_rol=r.id_rol JOIN hospitales h ON u.fk_id_hospital=h.id_hospital ORDER BY u.apellido")->fetchAll());
  }

  // --- LLAMADAS ---
  if ($resource === 'llamadas') {
    if ($method === 'GET') {
      $limit = intval($_GET['limit'] ?? 50);
      json_out($db->query("SELECT * FROM v_llamadas ORDER BY fecha_hora DESC LIMIT $limit")->fetchAll());
    }
    if ($method === 'POST') {
      $s = $db->prepare("INSERT INTO llamadas (fk_id_usuario,fk_id_robot,origen,destino,tipo_servicio) VALUES (?,?,?,?,?)");
      $s->execute([$body['fk_id_usuario'],$body['fk_id_robot'],$body['origen'],$body['destino'],$body['tipo_servicio']]);
      json_out(['id'=>$db->lastInsertId()], 201);
    }
  }

  // --- NOTIFICACIONES ---
  if ($resource === 'notificaciones') {
    if ($method === 'GET')
      json_out($db->query("SELECT * FROM v_notificaciones_pendientes LIMIT 100")->fetchAll());
    if ($method === 'POST') {
      $s = $db->prepare("INSERT INTO notificaciones (fk_id_robot,tipo,mensaje) VALUES (?,?,?)");
      $s->execute([$body['fk_id_robot'],$body['tipo']??'info',$body['mensaje']]);
      json_out(['id'=>$db->lastInsertId()], 201);
    }
    if ($method === 'PUT' && $id) {
      $db->prepare("UPDATE notificaciones SET leido=TRUE WHERE id_notif=?")->execute([$id]);
      json_out(['mensaje'=>'Marcada como leída']);
    }
  }

  json_out(['error'=>'Recurso no encontrado'], 404);

} catch (PDOException $e) {
  json_out(['error'=>'Error de base de datos: '.$e->getMessage()], 500);
}
?>