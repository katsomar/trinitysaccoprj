<?php
require_once '../config/db.php';
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

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "failed", "message" => "Invalid request format"]);
    exit;
}

// Validate input
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "failed", "message" => "Email and password are required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "status" => "success",
            "message" => "Successfully logged in",
            "details" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "name" => $user['name'] ?? null,
                "role" => $user['role']  

            ]
        ]);
    } else {
        echo json_encode(["status" => "failed", "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["status" => "failed", "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>