<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'] ?? '';
    $accountNumber = $_POST['account_number'] ?? '';

    if (empty($amount) || empty($accountNumber)) {
        echo json_encode(['error' => 'Amount and account number are required.']);
        exit;
    }

    // Simulate bank transfer processing
    echo json_encode(['success' => "Payment of $amount via bank transfer to account $accountNumber processed successfully."]);
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>