<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/conn.php';
require_once '../../session.php'; // Your JWT session check
require_once '../../vendor/autoload.php'; // Adjust path to autoloa

$userId = authenticate(); // Get user ID

$data = json_decode(file_get_contents("php://input"), true);
$amount = floatval($data['amount']);
$groupId = $data['group_id'];

if ($amount <= 0 || empty($groupId)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

// Save transaction
$stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, date) VALUES (?, ?, 'deposit', ?, NOW())");
$stmt->bind_param("isd", $userId,  $amount);
$stmt->execute();
$stmt->close();

// Update balance
$stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
$stmt->bind_param("di", $amount, $userId);
$stmt->execute();
$stmt->close();

echo json_encode(["status" => "success", "message" => "Deposit successful."]);
