<?php
require_once '../../config/db.php';
require_once '../../vendor/autoload.php'; // Adjust path to autoload

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "yummy03579";

// CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($password, $user['password'])) {
           $payload = [
  'iss' => 'http://localhost:5173',
  'iat' => time(),
  'exp' => time() + (60 * 60),
  'user' => [
    'id' => $user['id'],
    'name' => $user['name'],
  //  'avatar' => $user['avatar'],
   // 'account_number' => $user['account_number'],
    //'is_online' => $user['is_online']
  ]
];


            $jwt = JWT::encode($payload, $secret_key, 'HS256');

            echo json_encode([
                'message' => 'Login successful',
                'token' => $jwt,
                'role' => $user['role'],
                'name' => $user['name'] // Add this line
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
    }

    $conn->close();
}
?>