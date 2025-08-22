<?php
require_once 'config/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "Setting up role management system...\n";
    
    // Read and execute the SQL file
    $sql = file_get_contents('setup_role_permissions.sql');
    
    if (!$sql) {
        throw new Exception("Could not read setup_role_permissions.sql file");
    }
    
    // Split by semicolons and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            echo "Executing: " . substr($statement, 0, 50) . "...\n";
            $pdo->exec($statement);
        }
    }
    
    echo "✅ Database setup completed successfully!\n";
    
    // Verify setup
    $result = $pdo->query("SELECT COUNT(*) FROM roles");
    $roleCount = $result->fetchColumn();
    echo "Roles created: $roleCount\n";
    
    $result = $pdo->query("SELECT COUNT(*) FROM permissions");
    $permissionCount = $result->fetchColumn();
    echo "Permissions created: $permissionCount\n";
    
    $result = $pdo->query("SELECT COUNT(*) FROM role_permissions");
    $assignmentCount = $result->fetchColumn();
    echo "Role-permission assignments: $assignmentCount\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

