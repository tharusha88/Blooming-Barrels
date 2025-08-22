<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config/Database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check roles
    $stmt = $conn->prepare("SELECT * FROM roles ORDER BY id");
    $stmt->execute();
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'roles' => $roles,
        'role_count' => count($roles),
        'message' => 'Database check successful'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

