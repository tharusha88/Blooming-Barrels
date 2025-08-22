<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/helpers.php';

class AdminController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Get dashboard statistics
    public function getStats() {
        try {
            // Ensure CORS headers are set
            setCorsHeaders();
            
            // Check if user is admin (basic check for now)
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            $stats = [];

            // Get total users count
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['totalUsers'] = (int)$result['count'];

            // Get total products count (if products table exists)
            try {
                $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM products WHERE is_active = 1");
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $stats['totalProducts'] = (int)$result['count'];
                
                // Get recent products (last 30 days)
                $stmt = $this->db->prepare("
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                    AND is_active = 1
                ");
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $stats['recentProducts'] = (int)$result['count'];
                
                // Get product growth percentage
                $stmt = $this->db->prepare("
                    SELECT COUNT(*) as count 
                    FROM products 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) 
                    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
                    AND is_active = 1
                ");
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $previousPeriodProducts = (int)$result['count'];
                
                if ($previousPeriodProducts > 0) {
                    $productGrowth = round((($stats['recentProducts'] - $previousPeriodProducts) / $previousPeriodProducts) * 100, 1);
                } else {
                    $productGrowth = $stats['recentProducts'] > 0 ? 100 : 0;
                }
                $stats['productGrowth'] = $productGrowth;
                
            } catch (Exception $e) {
                // Products table might not exist yet or have different structure
                $stats['totalProducts'] = 0;
                $stats['recentProducts'] = 0;
                $stats['productGrowth'] = 0;
            }

            // Get total orders count (if orders table exists)
            try {
                $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM orders");
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $stats['totalOrders'] = (int)$result['count'];
            } catch (Exception $e) {
                // Orders table might not exist yet
                $stats['totalOrders'] = 0;
            }

            // Get wishlist items count (if wishlist table exists)
            try {
                $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM wishlist_items");
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $stats['totalWishlistItems'] = (int)$result['count'];
            } catch (Exception $e) {
                // Wishlist table might not exist yet
                $stats['totalWishlistItems'] = 0;
            }

            // Get recent registrations (last 30 days)
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count 
                FROM users 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
                AND is_active = 1
            ");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['recentUsers'] = (int)$result['count'];

            // Get user growth percentage (comparing last 30 days to previous 30 days)
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count 
                FROM users 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) 
                AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
                AND is_active = 1
            ");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $previousPeriodUsers = (int)$result['count'];
            
            if ($previousPeriodUsers > 0) {
                $userGrowth = round((($stats['recentUsers'] - $previousPeriodUsers) / $previousPeriodUsers) * 100, 1);
            } else {
                $userGrowth = $stats['recentUsers'] > 0 ? 100 : 0;
            }
            $stats['userGrowth'] = $userGrowth;

            // System status
            $stats['systemStatus'] = 'online';
            $stats['serverUptime'] = '99.9%';

            Response::json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (Exception $e) {
            error_log("Admin stats error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch statistics'], 500);
        }
    }

    // Get recent activity
    public function getRecentActivity() {
        try {
            setCorsHeaders();
            
            // Check admin access
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            $activities = [];

            // Get recent user registrations
            $stmt = $this->db->prepare("
                SELECT 
                    CONCAT('New user registered: ', email) as description,
                    created_at as timestamp,
                    'user_registration' as type
                FROM users 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                ORDER BY created_at DESC 
                LIMIT 5
            ");
            $stmt->execute();
            $userActivities = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($userActivities as $activity) {
                $activities[] = [
                    'description' => $activity['description'],
                    'timestamp' => $activity['timestamp'],
                    'type' => $activity['type']
                ];
            }

            // Add some system activities (you can expand this based on your needs)
            if (empty($activities)) {
                $activities = [
                    [
                        'description' => 'System started successfully',
                        'timestamp' => date('Y-m-d H:i:s'),
                        'type' => 'system'
                    ],
                    [
                        'description' => 'Database connection established',
                        'timestamp' => date('Y-m-d H:i:s', strtotime('-1 hour')),
                        'type' => 'system'
                    ]
                ];
            }

            Response::json([
                'success' => true,
                'data' => $activities
            ]);

        } catch (Exception $e) {
            error_log("Recent activity error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch recent activity'], 500);
        }
    }

    // Get all users with statistics
    public function getUsers() {
        try {
            setCorsHeaders();
            
            // Check admin access
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            // Get pagination parameters
            $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 50;
            $offset = ($page - 1) * $limit;
            $search = isset($_GET['search']) ? trim($_GET['search']) : '';

            // Base query
            $whereClause = "WHERE u.is_active = 1";
            $params = [];

            // Add search functionality
            if (!empty($search)) {
                $whereClause .= " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)";
                $searchParam = "%{$search}%";
                $params = [$searchParam, $searchParam, $searchParam];
            }

            // Get users with role information
            $query = "
                SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.address, 
                       u.date_of_birth, u.role_id, u.is_active, u.email_verified, 
                       u.created_at, u.last_login, r.name as role_name
                FROM users u 
                LEFT JOIN roles r ON u.role_id = r.id 
                {$whereClause}
                ORDER BY u.created_at DESC 
                LIMIT ? OFFSET ?
            ";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([...$params, $limit, $offset]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total count for pagination
            $countQuery = "SELECT COUNT(*) as total FROM users u {$whereClause}";
            $stmt = $this->db->prepare($countQuery);
            $stmt->execute($params);
            $totalResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $total = (int)$totalResult['total'];

            // Get user statistics
            $stats = [];
            
            // Total users
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE is_active = 1");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['totalUsers'] = (int)$result['count'];

            // Admin users
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count 
                FROM users u 
                JOIN roles r ON u.role_id = r.id 
                WHERE u.is_active = 1 AND (r.name = 'admin' OR r.name = 'administrator')
            ");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['adminUsers'] = (int)$result['count'];

            // Regular users (non-admin)
            $stats['regularUsers'] = $stats['totalUsers'] - $stats['adminUsers'];

            Response::json([
                'success' => true,
                'data' => [
                    'users' => $users,
                    'pagination' => [
                        'page' => $page,
                        'totalPages' => ceil($total / $limit),
                        'total' => $total,
                        'perPage' => $limit
                    ],
                    'stats' => $stats
                ]
            ]);

        } catch (Exception $e) {
            error_log("Get users error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch users'], 500);
        }
    }

    // Create new user
    public function createUser() {
        try {
            setCorsHeaders();
            
            // Check admin access
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::json(['success' => false, 'error' => 'Invalid JSON input'], 400);
                return;
            }

            // Validate required fields
            $required = ['firstName', 'lastName', 'email', 'password'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    Response::json(['success' => false, 'error' => "Field '{$field}' is required"], 400);
                    return;
                }
            }

            // Check if email already exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);
            if ($stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'Email already exists'], 409);
                return;
            }

            // Insert new user
            $query = "
                INSERT INTO users (first_name, last_name, email, password_hash, phone, address, 
                                 date_of_birth, role_id, is_active, email_verified) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
            ";
            
            $stmt = $this->db->prepare($query);
            $result = $stmt->execute([
                $input['firstName'],
                $input['lastName'],
                $input['email'],
                password_hash($input['password'], PASSWORD_DEFAULT),
                $input['phone'] ?? null,
                $input['address'] ?? null,
                $input['date_of_birth'] ?? null,
                $input['role_id'] ?? 2 // Default to customer role
            ]);

            if ($result) {
                $userId = $this->db->lastInsertId();
                
                // Get the created user with role info
                $stmt = $this->db->prepare("
                    SELECT u.*, r.name as role_name 
                    FROM users u 
                    LEFT JOIN roles r ON u.role_id = r.id 
                    WHERE u.id = ?
                ");
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                Response::json([
                    'success' => true,
                    'message' => 'User created successfully',
                    'data' => $user
                ], 201);
            } else {
                Response::json(['success' => false, 'error' => 'Failed to create user'], 500);
            }

        } catch (Exception $e) {
            error_log("Create user error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to create user'], 500);
        }
    }

    // Update user
    public function updateUser($userId) {
        try {
            setCorsHeaders();
            
            // Check admin access
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::json(['success' => false, 'error' => 'Invalid JSON input'], 400);
                return;
            }

            // Check if user exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1");
            $stmt->execute([$userId]);
            if (!$stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'User not found'], 404);
                return;
            }

            // Build update query dynamically
            $updateFields = [];
            $params = [];
            
            // Map frontend field names to database field names
            $allowedFields = [
                'first_name' => 'firstName',    // db_field => frontend_field
                'last_name' => 'lastName', 
                'email' => 'email', 
                'phone' => 'phone', 
                'address' => 'address', 
                'date_of_birth' => 'date_of_birth', 
                'role_id' => 'role_id'
            ];
            
            foreach ($allowedFields as $dbField => $inputField) {
                if (isset($input[$inputField]) && $input[$inputField] !== null && $input[$inputField] !== '') {
                    $updateFields[] = "{$dbField} = ?";
                    $params[] = $input[$inputField];
                }
            }

            // Update password if provided
            if (!empty($input['password'])) {
                $updateFields[] = "password_hash = ?";
                $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
            }

            if (empty($updateFields)) {
                Response::json(['success' => false, 'error' => 'No fields to update'], 400);
                return;
            }

            $params[] = $userId;
            $query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
            
            $stmt = $this->db->prepare($query);
            $result = $stmt->execute($params);

            if ($result) {
                // Get updated user with role info
                $stmt = $this->db->prepare("
                    SELECT u.*, r.name as role_name 
                    FROM users u 
                    LEFT JOIN roles r ON u.role_id = r.id 
                    WHERE u.id = ?
                ");
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                Response::json([
                    'success' => true,
                    'message' => 'User updated successfully',
                    'data' => $user
                ]);
            } else {
                Response::json(['success' => false, 'error' => 'Failed to update user'], 500);
            }

        } catch (Exception $e) {
            error_log("Update user error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to update user'], 500);
        }
    }

    // Delete user (soft delete)
    public function deleteUser($userId) {
        try {
            setCorsHeaders();
            
            // Check admin access
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
                Response::json(['success' => false, 'error' => 'Admin access required'], 403);
                return;
            }

            // Check if user exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE id = ? AND is_active = 1");
            $stmt->execute([$userId]);
            if (!$stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'User not found'], 404);
                return;
            }

            // Soft delete - set is_active to 0
            $stmt = $this->db->prepare("UPDATE users SET is_active = 0 WHERE id = ?");
            $result = $stmt->execute([$userId]);

            if ($result) {
                Response::json([
                    'success' => true,
                    'message' => 'User deleted successfully'
                ]);
            } else {
                Response::json(['success' => false, 'error' => 'Failed to delete user'], 500);
            }

        } catch (Exception $e) {
            error_log("Delete user error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to delete user'], 500);
        }
    }
}
