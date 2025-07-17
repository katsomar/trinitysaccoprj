<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_GET['token'] ?? '';

    if (empty($token)) {
        echo json_encode(['error' => 'Verification token is required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE verification_token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $updateStmt = $pdo->prepare("UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            echo json_encode(['success' => 'Email verified successfully.']);
        } else {
            echo json_encode(['error' => 'Invalid or expired token.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to verify email: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
