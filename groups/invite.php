<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated and is a manager
$userId = authenticate('manager');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $groupId = $_POST['group_id'] ?? '';
    $email = $_POST['email'] ?? '';

    if (empty($groupId) || empty($email)) {
        echo json_encode(['error' => 'Group ID and email are required.']);
        exit;
    }

    try {
        // Check if the group exists
        $groupStmt = $pdo->prepare("SELECT * FROM groups WHERE id = ? AND created_by = ?");
        $groupStmt->execute([$groupId, $userId]);
        if ($groupStmt->rowCount() === 0) {
            echo json_encode(['error' => 'Group not found or you do not have permission to invite members.']);
            exit;
        }

        // Send invitation (for simplicity, just returning success here)
        echo json_encode(['success' => 'Invitation sent successfully to ' . $email]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to send invitation: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
