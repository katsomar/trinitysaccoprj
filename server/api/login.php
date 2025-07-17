<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../.env.php';
$config = include('../.env.php');

header('Content-Type: application/json');

// Connect to the database
$conn = new mysqli($config['DB_HOST'], $config['DB_USER'], $config['DB_PASSWORD'], $config['DB_NAME']);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    // Query the database
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            http_response_code(200);
            echo json_encode(["success" => "Login successful", "user" => $user]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid password"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
