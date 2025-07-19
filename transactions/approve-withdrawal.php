<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated and is a manager
$userId = authenticate('manager');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $withdrawalId = $_POST['withdrawal_id'] ?? '';
    $paymentMethod = $_POST['payment_method'] ?? '';

    if (empty($withdrawalId) || empty($paymentMethod)) {
        echo json_encode(['error' => 'Withdrawal ID and payment method are required.']);
        exit;
    }

    try {
        // Check if the withdrawal request exists and is pending
        $stmt = $pdo->prepare("SELECT * FROM withdrawals WHERE id = ? AND status = 'pending'");
        $stmt->execute([$withdrawalId]);
        $withdrawal = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$withdrawal) {
            echo json_encode(['error' => 'Withdrawal request not found or already processed.']);
            exit;
        }

        // Approve the withdrawal
        $updateStmt = $pdo->prepare("UPDATE withdrawals SET status = 'approved', approve_date = NOW(), method = ? WHERE id = ?");
        $updateStmt->execute([$paymentMethod, $withdrawalId]);

        echo json_encode(['success' => 'Withdrawal approved successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to approve withdrawal: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
