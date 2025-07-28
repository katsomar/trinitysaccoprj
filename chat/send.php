<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $groupId = $_POST['group_id'] ?? '';
    $message = $_POST['message'] ?? '';

    if (empty($groupId) || empty($message)) {
        echo json_encode(['error' => 'Group ID and message are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chats (sender_id, group_id, message, timestamp) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$userId, $groupId, $message]);

        echo json_encode(['success' => 'Message sent successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to send message: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>