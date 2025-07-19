<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $method = $_POST['method'] ?? '';
    $amount = $_POST['amount'] ?? '';

    if (empty($method) || empty($amount)) {
        echo json_encode(['error' => 'Payment method and amount are required.']);
        exit;
    }

    // Simulate payment processing
    echo json_encode(['success' => "Payment of $amount via $method simulated successfully."]);
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
