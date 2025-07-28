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
require_once '../session.php'; // Your JWT session check
require_once '../../vendor/autoload.php'; // Adjust path to autoload

$userId = authenticate(); // Get user ID from token

// Get balance
$stmt = $conn->prepare("SELECT balance FROM member WHERE id = ?");
$stmt->bind_param("i", $memberId);
$stmt->execute();
$stmt->bind_result($balance);
$stmt->fetch();
$stmt->close();

// Get transactions
$stmt = $conn->prepare("SELECT id, type, amount, date FROM transactions WHERE member_id = ? ORDER BY date DESC LIMIT 10");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode([
    "balance" => $balance,
    "transactions" => $transactions
]);
