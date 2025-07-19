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

require_once '../config/db.php'; // Must provide $conn as PDO

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "failed", "message" => "Invalid request format"]);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "failed", "message" => "Email and password are required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password'])) {
            echo json_encode([
                "status" => "success",
                "message" => "Successfully logged in",
                "details" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "name" => $user['name'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            echo json_encode(["status" => "failed", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "failed", "message" => "User not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "failed", "message" => "Database error: " . $e->getMessage()]);
}
?>
