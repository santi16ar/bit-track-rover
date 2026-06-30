<?php
// ============================================
// api.php — versión simplificada
// ============================================

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

define('DB_HOST', 'localhost');
define('DB_USER', 'root');   // ← cambiá por tu usuario
define('DB_PASS', '');       // ← cambiá por tu contraseña
define('DB_NAME', 'bit_track_bdd');

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

  // --- 1) LISTAR HOSPITALES (para el <select> del HTML) ---
  if ($resource === 'hospitales' && $method === 'GET') {
    json_out($db->query("SELECT id_hospital, nombre, ciudad FROM hospitales ORDER BY nombre")->fetchAll());
  }

  // --- 2) REGISTRO (el rover se asigna automáticamente) ---
  if ($resource === 'registro' && $method === 'POST') {
    $nombre     = trim($body['nombre'] ?? '');
    $email      = trim($body['email'] ?? '');
    $password   = $body['password'] ?? '';
    $hospitalId = intval($body['fk_hospital'] ?? 0);

    if (!$nombre || !$email || !$password || !$hospitalId) {
      json_out(['ok' => false, 'error' => 'Completá todos los campos'], 400);
    }

    // Chequear email repetido
    $check = $db->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) json_out(['ok' => false, 'error' => 'Ya existe una cuenta con ese email'], 409);

    // Buscar el primer rover disponible del hospital automáticamente
    $rcheck = $db->prepare("SELECT id_robot, codigo, modelo FROM robots WHERE fk_hospital = ? AND disponible = TRUE LIMIT 1");
    $rcheck->execute([$hospitalId]);
    $robot = $rcheck->fetch();
    if (!$robot) {
      json_out(['ok' => false, 'error' => 'No hay rovers disponibles en ese hospital'], 409);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    // Transacción: crear usuario + marcar rover como no disponible
    $db->beginTransaction();
    $ins = $db->prepare("INSERT INTO usuarios (nombre, email, contrasena, fk_hospital, fk_robot) VALUES (?,?,?,?,?)");
    $ins->execute([$nombre, $email, $hash, $hospitalId, $robot['id_robot']]);
    $newId = $db->lastInsertId();

    $db->prepare("UPDATE robots SET disponible = FALSE WHERE id_robot = ?")->execute([$robot['id_robot']]);
    $db->commit();

    json_out([
      'ok'           => true,
      'id_usuario'   => $newId,
      'rover_codigo' => $robot['codigo'],
      'rover_modelo' => $robot['modelo']
    ], 201);
  }

  // --- 4) LOGIN ---
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

  json_out(['error' => 'Recurso no encontrado'], 404);

} catch (PDOException $e) {
  json_out(['error' => 'Error de base de datos: ' . $e->getMessage()], 500);
}