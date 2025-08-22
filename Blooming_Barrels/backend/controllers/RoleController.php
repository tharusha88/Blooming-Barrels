<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../utils/Response.php';

class RoleController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Get all roles with their permissions
    public function getRoles() {
        try {
            setCorsHeaders();
            
            // TODO: Re-enable admin check after testing
            // Check admin access
            // if (session_status() === PHP_SESSION_NONE) {
            //     session_start();
            // }
            
            // if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            //     Response::json(['success' => false, 'error' => 'Admin access required'], 403);
            //     return;
            // }

            // Get roles with permission counts and user counts
            $query = "
                SELECT 
                    r.id,
                    r.name,
                    r.description,
                    r.created_at,
                    COUNT(DISTINCT rp.permission_id) as permission_count,
                    COUNT(DISTINCT u.id) as user_count
                FROM roles r
                LEFT JOIN role_permissions rp ON r.id = rp.role_id
                LEFT JOIN users u ON r.id = u.role_id AND u.is_active = 1
                GROUP BY r.id, r.name, r.description, r.created_at
                ORDER BY r.id
            ";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Response::json([
                'success' => true,
                'data' => $roles
            ]);

        } catch (Exception $e) {
            error_log("Get roles error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch roles'], 500);
        }
    }

    // Get role details with permissions
    public function getRoleDetails($roleId) {
        try {
            setCorsHeaders();
            
            // TODO: Re-enable admin check after testing
            // Check admin access
            // if (session_status() === PHP_SESSION_NONE) {
            //     session_start();
            // }
            
            // if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            //     Response::json(['success' => false, 'error' => 'Admin access required'], 403);
            //     return;
            // }

            // Get role information
            $stmt = $this->db->prepare("SELECT * FROM roles WHERE id = ?");
            $stmt->execute([$roleId]);
            $role = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$role) {
                Response::json(['success' => false, 'error' => 'Role not found'], 404);
                return;
            }

            // Get role permissions
            $stmt = $this->db->prepare("
                SELECT p.* 
                FROM permissions p 
                INNER JOIN role_permissions rp ON p.id = rp.permission_id 
                WHERE rp.role_id = ?
                ORDER BY p.category, p.name
            ");
            $stmt->execute([$roleId]);
            $permissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Response::json([
                'success' => true,
                'data' => [
                    'role' => $role,
                    'permissions' => $permissions
                ]
            ]);

        } catch (Exception $e) {
            error_log("Get role details error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch role details'], 500);
        }
    }

    // Get all available permissions
    public function getPermissions() {
        try {
            setCorsHeaders();
            
            // TODO: Re-enable admin check after testing
            // Check admin access
            // if (session_status() === PHP_SESSION_NONE) {
            //     session_start();
            // }
            
            // if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            //     Response::json(['success' => false, 'error' => 'Admin access required'], 403);
            //     return;
            // }

            $stmt = $this->db->prepare("
                SELECT * FROM permissions 
                ORDER BY category, name
            ");
            $stmt->execute();
            $permissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Group permissions by category
            $groupedPermissions = [];
            foreach ($permissions as $permission) {
                $category = $permission['category'] ?? 'other';
                if (!isset($groupedPermissions[$category])) {
                    $groupedPermissions[$category] = [];
                }
                $groupedPermissions[$category][] = $permission;
            }

            Response::json([
                'success' => true,
                'data' => [
                    'permissions' => $permissions,
                    'grouped' => $groupedPermissions
                ]
            ]);

        } catch (Exception $e) {
            error_log("Get permissions error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to fetch permissions'], 500);
        }
    }

    // Update role permissions
    public function updateRolePermissions($roleId) {
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

            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['permissions'])) {
                Response::json(['success' => false, 'error' => 'Invalid input data'], 400);
                return;
            }

            // Check if role exists
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE id = ?");
            $stmt->execute([$roleId]);
            if (!$stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'Role not found'], 404);
                return;
            }

            // Start transaction
            $this->db->beginTransaction();

            try {
                // Remove existing permissions for this role
                $stmt = $this->db->prepare("DELETE FROM role_permissions WHERE role_id = ?");
                $stmt->execute([$roleId]);

                // Add new permissions
                if (!empty($input['permissions'])) {
                    $stmt = $this->db->prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
                    foreach ($input['permissions'] as $permissionId) {
                        $stmt->execute([$roleId, $permissionId]);
                    }
                }

                $this->db->commit();

                Response::json([
                    'success' => true,
                    'message' => 'Role permissions updated successfully'
                ]);

            } catch (Exception $e) {
                $this->db->rollback();
                throw $e;
            }

        } catch (Exception $e) {
            error_log("Update role permissions error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to update role permissions'], 500);
        }
    }

    // Create new role
    public function createRole() {
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

            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || empty($input['name'])) {
                Response::json(['success' => false, 'error' => 'Role name is required'], 400);
                return;
            }

            // Check if role name already exists
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE name = ?");
            $stmt->execute([$input['name']]);
            if ($stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'Role name already exists'], 409);
                return;
            }

            // Create role
            $stmt = $this->db->prepare("INSERT INTO roles (name, description) VALUES (?, ?)");
            $result = $stmt->execute([
                $input['name'],
                $input['description'] ?? ''
            ]);

            if ($result) {
                $roleId = $this->db->lastInsertId();

                // Add permissions if provided
                if (!empty($input['permissions'])) {
                    $stmt = $this->db->prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
                    foreach ($input['permissions'] as $permissionId) {
                        $stmt->execute([$roleId, $permissionId]);
                    }
                }

                Response::json([
                    'success' => true,
                    'message' => 'Role created successfully',
                    'data' => ['id' => $roleId]
                ], 201);
            } else {
                Response::json(['success' => false, 'error' => 'Failed to create role'], 500);
            }

        } catch (Exception $e) {
            error_log("Create role error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to create role'], 500);
        }
    }

    // Update role
    public function updateRole($roleId) {
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

            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::json(['success' => false, 'error' => 'Invalid input data'], 400);
                return;
            }

            // Check if role exists
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE id = ?");
            $stmt->execute([$roleId]);
            if (!$stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'Role not found'], 404);
                return;
            }

            // Update role
            $updateFields = [];
            $params = [];

            if (isset($input['name'])) {
                $updateFields[] = "name = ?";
                $params[] = $input['name'];
            }

            if (isset($input['description'])) {
                $updateFields[] = "description = ?";
                $params[] = $input['description'];
            }

            if (!empty($updateFields)) {
                $params[] = $roleId;
                $query = "UPDATE roles SET " . implode(', ', $updateFields) . " WHERE id = ?";
                $stmt = $this->db->prepare($query);
                $stmt->execute($params);
            }

            Response::json([
                'success' => true,
                'message' => 'Role updated successfully'
            ]);

        } catch (Exception $e) {
            error_log("Update role error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to update role'], 500);
        }
    }

    // Delete role
    public function deleteRole($roleId) {
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

            // Check if role exists
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE id = ?");
            $stmt->execute([$roleId]);
            if (!$stmt->fetch()) {
                Response::json(['success' => false, 'error' => 'Role not found'], 404);
                return;
            }

            // Check if role is in use
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE role_id = ? AND is_active = 1");
            $stmt->execute([$roleId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['count'] > 0) {
                Response::json(['success' => false, 'error' => 'Cannot delete role that is assigned to users'], 400);
                return;
            }

            // Delete role (this will cascade delete role_permissions)
            $stmt = $this->db->prepare("DELETE FROM roles WHERE id = ?");
            $result = $stmt->execute([$roleId]);

            if ($result) {
                Response::json([
                    'success' => true,
                    'message' => 'Role deleted successfully'
                ]);
            } else {
                Response::json(['success' => false, 'error' => 'Failed to delete role'], 500);
            }

        } catch (Exception $e) {
            error_log("Delete role error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Failed to delete role'], 500);
        }
    }
}
