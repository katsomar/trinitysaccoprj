<?php
// Set the content type to JSON for API responses
header('Content-Type: application/json');

// Welcome message for the backend
if ($_SERVER['REQUEST_URI'] === '/trinitysaccoprj/server') {
    echo json_encode([
        'message' => 'Welcome to the Trinity SACCO Backend!',
        'status' => 'success'
    ]);
    exit;
}

// Handle undefined routes
http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found',
    'status' => 'error'
]);
?>
