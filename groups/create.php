<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated and is a manager
$userId = authenticate('manager');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $interestRate = $_POST['interest_rate'] ?? '';
    $periodDays = $_POST['period_days'] ?? '';

    if (empty($name) || empty($interestRate) || empty($periodDays)) {
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO groups (name, icon, created_by, interest_rate, period_days) VALUES (?, NULL, ?, ?, ?)");
        $stmt->execute([$name, $userId, $interestRate, $periodDays]);

        echo json_encode(['success' => 'Group created successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to create group: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
