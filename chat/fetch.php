<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $groupId = $_GET['group_id'] ?? '';

    if (empty($groupId)) {
        echo json_encode(['error' => 'Group ID is required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT chats.message, chats.timestamp, users.name AS sender_name FROM chats JOIN users ON chats.sender_id = users.id WHERE chats.group_id = ? ORDER BY chats.timestamp ASC");
        $stmt->execute([$groupId]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'messages' => $messages]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch messages: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
