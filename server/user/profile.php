<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT id, name, email, phone, role, profile_pic FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['error' => 'User not found.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch profile: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
