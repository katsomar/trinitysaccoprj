<?php
// Set the content type to JSON for API responses
header('Content-Type: application/json');

// Extract the requested URI and remove the base path
$requestUri = str_replace('/trinitysaccoprj/server', '', $_SERVER['REQUEST_URI']);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Normalize the request URI
$requestUri = trim($requestUri, '/');

// Route API requests
if (strpos($requestUri, 'api/') === 0) {
    $apiPath = __DIR__ . '/' . $requestUri . '.php';

    if (file_exists($apiPath)) {
        require_once $apiPath;
        exit;
    } else {
        http_response_code(404);
        echo json_encode([
            'error' => 'API endpoint not found',
            'status' => 'error'
        ]);
        exit;
    }
}

// Handle undefined routes
http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found',
    'status' => 'error'
]);
?>
http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found',
    'status' => 'error'
]);
?>
