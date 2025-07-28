<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/conn.php';
require_once '../config/database.php';    

$userId = authenticate(); // Get user ID


// Fetch recent chats
$stmt = $conn->prepare("
    SELECT id, sender_name AS name, message_preview AS preview, unread
    FROM chatz
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 10
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$chats = [];
while ($row = $result->fetch_assoc()) {
    $chats[] = $row;
}

echo json_encode($chats);
