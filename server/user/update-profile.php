<?php
require_once '../config/db.php';
require_once '../utils/auth-middleware.php';

// Ensure the user is authenticated
$userId = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $profilePic = $_FILES['profile_pic'] ?? null;

    if (empty($name) || empty($phone)) {
        echo json_encode(['error' => 'Name and phone are required.']);
        exit;
    }

    try {
        // Handle profile picture upload
        $profilePicPath = null;
        if ($profilePic && $profilePic['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/';
            $profilePicPath = $uploadDir . basename($profilePic['name']);
            move_uploaded_file($profilePic['tmp_name'], $profilePicPath);
        }

        // Update user details
        $stmt = $pdo->prepare("UPDATE users SET name = ?, phone = ?, profile_pic = ? WHERE id = ?");
        $stmt->execute([$name, $phone, $profilePicPath, $userId]);

        echo json_encode(['success' => 'Profile updated successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to update profile: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>