<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $role = $_POST['role'] ?? '';
    $password = $_POST['password'] ?? '';

    // Validate inputs
    if (empty($name) || empty($email) || empty($phone) || empty($role) || empty($password)) {
        echo json_encode(['error' => 'All fields are required.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Invalid email format.']);
        exit;
    }

    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) {
        echo json_encode(['error' => 'Password must include uppercase, lowercase, number, and be at least 8 characters long.']);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Insert user into the database
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $role, $hashedPassword]);

        echo json_encode(['success' => 'User registered successfully.']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate entry
            echo json_encode(['error' => 'Email already exists.']);
        } else {
            echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
        }
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
