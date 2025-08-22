<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Check roles
    $stmt = $pdo->query("SELECT id, name, description FROM roles ORDER BY id");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check permissions
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM permissions");
    $permissions = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check role-permission assignments
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM role_permissions");
    $assignments = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Database setup check',
        'roles' => $roles,
        'total_roles' => count($roles),
        'total_permissions' => $permissions['count'],
        'total_assignments' => $assignments['count']
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

