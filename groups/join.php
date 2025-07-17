<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $groupId = $_POST['group_id'] ?? '';

    if (empty($groupId)) {
        echo json_encode(['error' => 'Group ID is required.']);
        exit;
    }

    try {
        // Check if the user is already a member
        $checkStmt = $pdo->prepare("SELECT * FROM group_members WHERE user_id = ? AND group_id = ?");
        $checkStmt->execute([$userId, $groupId]);
        if ($checkStmt->rowCount() > 0) {
            echo json_encode(['error' => 'You are already a member of this group.']);
            exit;
        }

        // Add the user to the group
        $stmt = $pdo->prepare("INSERT INTO group_members (user_id, group_id, join_date) VALUES (?, ?, NOW())");
        $stmt->execute([$userId, $groupId]);

        echo json_encode(['success' => 'Successfully joined the group.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to join group: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
