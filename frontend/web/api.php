<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/config.php'

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
$body     = json_decode(file_get_contents('php://input'), true) ?? [];

try {
  $db = getDB();
  if ($resource === 'hospitales' && $method === 'GET') {
    json_out($db->query("SELECT id_hospital, nombre, ciudad FROM hospitales ORDER BY nombre")->fetchAll());
  }

  if ($resource === 'registro' && $method === 'POST') {
    $nombre     = trim($body['nombre'] ?? '');
    $email      = trim($body['email'] ?? '');
    $password   = $body['password'] ?? '';
    $hospitalId = intval($body['fk_hospital'] ?? 0);

    if (!$nombre || !$email || !$password || !$hospitalId) {
      json_out(['ok' => false, 'error' => 'Completá todos los campos'], 400);
    }

    $check = $db->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) json_out(['ok' => false, 'error' => 'Ya existe una cuenta con ese email'], 409);

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $db->beginTransaction();

    // Rover libre para asignar. Si no queda ninguno, se da de alta uno nuevo
    // para que el registro nunca frene por falta de flota.
    $rcheck = $db->prepare("SELECT id_robot, codigo, modelo FROM robots WHERE disponible = TRUE ORDER BY id_robot LIMIT 1");
    $rcheck->execute([]);
    $robot = $rcheck->fetch();

    if (!$robot) {
      $alta = $db->prepare("INSERT INTO robots (codigo, modelo, disponible, fk_hospital) VALUES (?, ?, FALSE, ?)");
      $alta->execute(['TMP-' . uniqid(), 'Rover nuevo', $hospitalId]);
      $idRobot = intval($db->lastInsertId());

      // Código y modelo derivados del id para que nunca se repitan
      $codigo = 'ROB-' . str_pad((string) $idRobot, 3, '0', STR_PAD_LEFT);
      $modelo = 'Rover' . str_pad((string) $idRobot, 2, '0', STR_PAD_LEFT);

      // Si ese código ya existe en la tabla, lo desviamos para no romper la UNIQUE
      $existe = $db->prepare("SELECT id_robot FROM robots WHERE codigo = ?");
      $existe->execute([$codigo]);
      if ($existe->fetch()) {
        $codigo = 'ROB-' . $idRobot . '-' . strtoupper(substr(uniqid(), -4));
      }

      $db->prepare("UPDATE robots SET codigo = ?, modelo = ? WHERE id_robot = ?")
         ->execute([$codigo, $modelo, $idRobot]);

      $robot = ['id_robot' => $idRobot, 'codigo' => $codigo, 'modelo' => $modelo];
    } else {
      $db->prepare("UPDATE robots SET disponible = FALSE WHERE id_robot = ?")->execute([$robot['id_robot']]);
    }

    $ins = $db->prepare("INSERT INTO usuarios (nombre, email, contrasena, fk_hospital, fk_robot) VALUES (?,?,?,?,?)");
    $ins->execute([$nombre, $email, $hash, $hospitalId, $robot['id_robot']]);
    $newId = $db->lastInsertId();

    $db->commit();

    json_out([
      'ok'           => true,
      'id_usuario'   => $newId,
      'rover_codigo' => $robot['codigo'],
      'rover_modelo' => $robot['modelo']
    ], 201);
  }

  if ($resource === 'login' && $method === 'POST') {
    $email    = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    $s = $db->prepare("
      SELECT u.id_usuario, u.nombre, u.email, u.contrasena,
             h.nombre AS hospital, h.ciudad,
             r.codigo AS robot_codigo, r.modelo AS robot_modelo
      FROM usuarios u
      JOIN hospitales h ON u.fk_hospital = h.id_hospital
      LEFT JOIN robots r ON u.fk_robot = r.id_robot
      WHERE u.email = ?
    ");
    $s->execute([$email]);
    $user = $s->fetch();

    if (!$user || !password_verify($password, $user['contrasena'])) {
      json_out(['ok' => false, 'error' => 'Email o contraseña incorrectos'], 401);
    }

    unset($user['contrasena']);
    json_out(['ok' => true, 'usuario' => $user]);
  }

  if ($resource === 'cuenta' && $method === 'DELETE') {
    $idUsuario = intval($body['id_usuario'] ?? 0);
    $password  = $body['password'] ?? '';

    if (!$idUsuario || !$password) {
      json_out(['ok' => false, 'error' => 'Faltan datos para eliminar la cuenta'], 400);
    }

    $s = $db->prepare("SELECT id_usuario, contrasena, fk_robot FROM usuarios WHERE id_usuario = ?");
    $s->execute([$idUsuario]);
    $user = $s->fetch();

    if (!$user || !password_verify($password, $user['contrasena'])) {
      json_out(['ok' => false, 'error' => 'Contraseña incorrecta, no se pudo eliminar la cuenta'], 401);
    }

    $db->beginTransaction();
    // Liberar el rover asignado para que quede disponible de nuevo
    if (!empty($user['fk_robot'])) {
      $db->prepare("UPDATE robots SET disponible = TRUE WHERE id_robot = ?")->execute([$user['fk_robot']]);
    }
    $db->prepare("DELETE FROM usuarios WHERE id_usuario = ?")->execute([$idUsuario]);
    $db->commit();

    json_out(['ok' => true, 'mensaje' => 'Cuenta y datos eliminados correctamente']);
  }

  json_out(['error' => 'Recurso no encontrado'], 404);

} catch (PDOException $e) {
  json_out(['error' => 'Error de base de datos: ' . $e->getMessage()], 500);
}