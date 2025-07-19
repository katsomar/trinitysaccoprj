<?php
// CORS headers must come first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Enable errors
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php'; // Make sure this sets up PDO as $conn

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "failed", "message" => "Invalid request format"]);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$role = trim($data['role'] ?? '');
$password = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($phone) || empty($role) || empty($password)) {
    echo json_encode(["status" => "failed", "message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "failed", "message" => "Invalid email format"]);
    exit;
}

if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) {
    echo json_encode(["status" => "failed", "message" => "Password must include uppercase, lowercase, number, and be at least 8 characters long."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    // Check if email exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->rowCount() > 0) {
        echo json_encode(["status" => "failed", "message" => "Email already exists"]);
        exit;
    }

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $role, $hashedPassword]);

    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "failed", "message" => "Database error: " . $e->getMessage()]);
}
?>
