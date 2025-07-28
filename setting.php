//<?php
// CORS for preflight
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     header("Access-Control-Allow-Origin: http://localhost:5173");
//     header("Access-Control-Allow-Headers: Content-Type, Authorization");
//     header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
//     header("Access-Control-Max-Age: 86400");
//     http_response_code(204);
//     exit;
// }
// CORS for all requests
// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Content-Type: application/json");

//require_once '../session.php'; // Your JWT session check
//require_once '../config/db.php'; // Your DB connection (mysqli $conn assumed)
//require_once '../../vendor/autoload.php'; // Adjust path to autoload

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     header("Access-Control-Allow-Origin: http://localhost:5173");
//     header("Access-Control-Allow-Headers: Content-Type, Authorization");
//     header("Access-Control-Allow-Methods: POST, OPTIONS");
//     header("Access-Control-Max-Age: 86400");
//     http_response_code(204);
//     exit;
// }

// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Methods: PUT");
// header("Content-Type: application/json");

// if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
//     http_response_code(405);
//     echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
//     exit;
// }

// $input = json_decode(file_get_contents("php://input"), true);
// $currentPassword = $input['currentPassword'] ?? '';
// $newPassword = $input['newPassword'] ?? '';

// if (!$currentPassword || !$newPassword) {
//     http_response_code(400);
//     echo json_encode(['status' => 'error', 'message' => 'Missing password fields']);
//     exit;
// }

// $userId = authenticate(); // From session.php

// Fetch user from DB
// $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
// $stmt->bind_param("i", $userId);
// $stmt->execute();
// $result = $stmt->get_result();

// if ($result->num_rows === 0) {
//     http_response_code(404);
//     echo json_encode(['status' => 'error', 'message' => 'User not found']);
//     exit;
// }

// $user = $result->fetch_assoc();

// Verify current password
// if (!password_verify($currentPassword, $user['password'])) {
//     http_response_code(401);
//     echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect']);
//     exit;
// }

// Hash new password and update
// $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
// $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
// $updateStmt->bind_param("si", $newHashedPassword, $userId);

// if ($updateStmt->execute()) {
//     echo json_encode(['status' => 'success', 'message' => 'Password updated']);
// } else {
//     http_response_code(500);
//     echo json_encode(['status' => 'error', 'message' => 'Failed to update password']);
// }