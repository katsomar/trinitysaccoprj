<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/conn.php';
require_once '../../session.php'; // Your JWT session check
require_once '../../vendor/autoload.php'; // Adjust path to autoload

$userId = authenticate();

$stmt = $conn->prepare("SELECT name, account_number FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($name, $accountNumber);
if ($stmt->fetch()) {
    $response = [
        "name" => $name,
        "accountNumber" => $accountNumber
    ];
} else {
    http_response_code(404);
    $response = [
        "status" => "error",
        "message" => "User not found"
    ];
}
$stmt->close();

echo json_encode($response);
