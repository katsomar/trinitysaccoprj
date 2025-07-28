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
require_once '../../config/db.php';
require_once '../session.php'; // Include session handling for JWT
require_once '../../vendor/autoload.php'; // Adjust path to autoload

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = mysqli_real_escape_string($conn, $user_data->id);

    mysqli_query($conn, "UPDATE users SET profile_pic = 1 WHERE id = '$id'");
    echo json_encode(['message' => 'ID verification requested']);
    exit;
}

http_response_code(405);
