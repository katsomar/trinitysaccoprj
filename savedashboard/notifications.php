<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require '../config/database.php'; // adjust if needed
require '../config/session'; // adjust if you validate JWT here

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Get the token from headers
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(["message" => "No authorization token provided."]);
    exit;
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

try {
    $decoded = JWT::decode($token, new Key('yummy03579', 'HS256'));
    $user_id = $decoded->user_id ?? null;

    if (!$user_id) {
        throw new Exception("Invalid token payload");
    }

    $stmt = $conn->prepare("SELECT id, text FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }

    echo json_encode($notifications);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized: " . $e->getMessage()]);
}
