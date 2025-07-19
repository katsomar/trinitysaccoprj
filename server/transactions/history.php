<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $role = $_GET['role'] ?? '';
    $page = $_GET['page'] ?? 1;
    $limit = $_GET['limit'] ?? 10;
    $offset = ($page - 1) * $limit;

    try {
        if ($role === 'manager') {
            // Fetch all transactions for managers
            $stmt = $pdo->prepare("SELECT * FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?");
            $stmt->execute([$limit, $offset]);
        } else {
            // Fetch transactions for the authenticated user
            $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?");
            $stmt->execute([$userId, $limit, $offset]);
        }

        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'transactions' => $transactions]);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch transaction history: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>