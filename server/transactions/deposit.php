<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'] ?? '';
    $method = $_POST['method'] ?? '';
    $groupId = $_POST['group_id'] ?? '';

    if (empty($amount) || empty($method) || empty($groupId)) {
        echo json_encode(['error' => 'Amount, method, and group ID are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO deposits (user_id, amount, method, date, group_id) VALUES (?, ?, ?, NOW(), ?)");
        $stmt->execute([$userId, $amount, $method, $groupId]);

        echo json_encode(['success' => 'Deposit successful.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to process deposit: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>