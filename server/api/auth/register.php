<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once '../../config/db.php';

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "failed", "message" => "Invalid request format"]);
    exit;
}

// Extract values with fallback
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$role = trim($data['role'] ?? '');
$password = $data['password'] ?? '';

// Validate inputs
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

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $conn->prepare("INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $role, $hashedPassword]);
    echo json_encode(["status" => "success", "message" => "User registered successfully."]);
    exit;

} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
        echo json_encode(["status" => "failed", "message" => "Email already exists."]);
        exit;
    } else {
        echo json_encode(["status" => "failed", "message" => 'Database error: ' . $e->getMessage()]);
        exit;
    }
}
