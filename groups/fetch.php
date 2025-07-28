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
        // Fetch group details
        $groupStmt = $pdo->prepare("SELECT * FROM groups WHERE id = ?");
        $groupStmt->execute([$groupId]);
        $group = $groupStmt->fetch(PDO::FETCH_ASSOC);

        if (!$group) {
            echo json_encode(['error' => 'Group not found.']);
            exit;
        }

        // Fetch group members
        $membersStmt = $pdo->prepare("SELECT users.id, users.name FROM group_members JOIN users ON group_members.user_id = users.id WHERE group_members.group_id = ?");
        $membersStmt->execute([$groupId]);
        $members = $membersStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'group' => $group, 'members' => $members]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch group details: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>