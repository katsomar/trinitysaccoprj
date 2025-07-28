<?php
// CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require '../config.php';
require_once '../../config/db.php';
require_once '../../vendor/autoload.php'; // Adjust path to autoload
require_once '../session.php'; // Include session handling for JWT


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     $id = mysqli_real_escape_string($conn, authenticate());
    mysqli_query($conn, "UPDATE users SET verified = 1 WHERE id = '$id'");
    echo json_encode(['message' => 'Email verification requested']);
    exit;
}
$userId = authenticate(); // From session.php



http_response_code(405); // Method Not Allowed
