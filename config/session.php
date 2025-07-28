<?php
require_once '../../vendor/autoload.php'; // Adjust path to autoload
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "yummy03579";

function authenticate() {
    $headers = apache_request_headers();
    $auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$auth_header || !preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No token provided']);
        exit;
    }

    $jwt = $matches[1];
    global $secret_key;

    try {
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
     return $decoded->user; // return full user object (with name, avatar, etc.)
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid token: ' . $e->getMessage()]);
        exit;
    }
}
?>