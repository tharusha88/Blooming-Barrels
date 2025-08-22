<?php
require_once 'config/constants.php';
require_once 'config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if admin user already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute(['admin@bloominbarrels.com']);
    
    if ($stmt->rowCount() > 0) {
        echo "Admin user already exists!\n";
        exit;
    }
    
    // Get admin role ID
    $stmt = $db->prepare("SELECT id FROM roles WHERE name = 'admin'");
    $stmt->execute();
    $adminRole = $stmt->fetch();
    
    if (!$adminRole) {
        echo "Admin role not found. Creating admin role...\n";
        $stmt = $db->prepare("INSERT INTO roles (name, description) VALUES ('admin', 'Administrator role')");
        $stmt->execute();
        $adminRoleId = $db->lastInsertId();
    } else {
        $adminRoleId = $adminRole['id'];
    }
    
    // Create admin user
    $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
    
    $stmt = $db->prepare("
        INSERT INTO users (first_name, last_name, email, password_hash, role_id, is_active, email_verified, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $result = $stmt->execute([
        'Admin',
        'User',
        'admin@bloominbarrels.com',
        $hashedPassword,
        $adminRoleId,
        1,
        1
    ]);
    
    if ($result) {
        echo "Admin user created successfully!\n";
        echo "Email: admin@bloominbarrels.com\n";
        echo "Password: admin123\n";
    } else {
        echo "Failed to create admin user.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

