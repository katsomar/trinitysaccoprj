<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'] ?? '';
    $phoneNumber = $_POST['phone_number'] ?? '';

    if (empty($amount) || empty($phoneNumber)) {
        echo json_encode(['error' => 'Amount and phone number are required.']);
        exit;
    }

    // Simulate Airtel payment processing
    echo json_encode(['success' => "Payment of $amount via Airtel Money to $phoneNumber processed successfully."]);
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>