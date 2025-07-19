<?php
require_once '../config/db.php';

function authenticate($requiredRole = null) {
    session_start();

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'Unauthorized access.']);
        exit;
    }

    $userId = $_SESSION['user_id'];
    $role = $_SESSION['role'];

    if ($requiredRole && $role !== $requiredRole) {
        echo json_encode(['error' => 'Access denied.']);
        exit;
    }

    return $userId;
}
?>