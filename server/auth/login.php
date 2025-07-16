<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validate inputs
    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'Email and password are required.']);
        exit;
    }

    try {
        // Fetch user from the database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Generate a session or token (for simplicity, using session here)
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            echo json_encode(['success' => 'Login successful.', 'role' => $user['role']]);
        } else {
            echo json_encode(['error' => 'Invalid email or password.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
