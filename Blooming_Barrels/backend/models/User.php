
<?php

require_once __DIR__ . '/../config/Database.php';

class User {
    private $db;
    private $table = 'users';

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getById($id) {
        return $this->findById($id);
    }

    // Change password
    public function changePassword($id, $old_password, $new_password) {
        $user = $this->findById($id);
        if (!$user) {
            return 'User not found';
        }
        if (!password_verify($old_password, $user['password_hash'])) {
            return 'Old password is incorrect';
        }
        $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $query = "UPDATE " . $this->table . " SET password_hash = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        if ($stmt->execute([$new_hash, $id])) {
            return true;
        } else {
            return 'Failed to update password';
        }
    }

    // Create new user
    public function create($data) {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (first_name, last_name, email, password_hash, phone, address, date_of_birth, role_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($query);
            
            // Hash the password if it's provided
            $password_hash = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';
            
            // Log incoming data
            error_log('User create - Raw input data: ' . print_r($data, true));
            
            // Ensure role_id is set and is a valid integer
            $role_id = isset($data['role_id']) ? (int)$data['role_id'] : DEFAULT_ROLE_ID;
            error_log("User create - Using role_id: $role_id (Type: " . gettype($role_id) . ")");
            
            // Verify the role exists
            $role_check = $this->db->prepare("SELECT id, name FROM roles WHERE id = ?");
            $role_check->execute([$role_id]);
            $role = $role_check->fetch(PDO::FETCH_ASSOC);
            
            if (!$role) {
                error_log("User create - Invalid role_id: $role_id");
                // Fall back to default role if specified role doesn't exist
                $role_id = DEFAULT_ROLE_ID;
                error_log("User create - Falling back to default role_id: $role_id");
            } else {
                error_log("User create - Valid role found: " . print_r($role, true));
            }
            
            $params = [
                $data['first_name'] ?? '',
                $data['last_name'] ?? '',
                $data['email'] ?? '',
                $password_hash,
                $data['phone'] ?? null,
                $data['address'] ?? null,
                $data['date_of_birth'] ?? null,
                $role_id
            ];
            
            error_log('User create - Final parameters: ' . print_r($params, true));
            
            $result = $stmt->execute($params);

            if ($result) {
                return $this->db->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("User creation error: " . $e->getMessage());
            return false;
        }
    }

    // Find user by email
    public function findByEmail($email) {
        try {
            $query = "SELECT u.*, r.name as role_name 
                     FROM " . $this->table . " u 
                     LEFT JOIN roles r ON u.role_id = r.id 
                     WHERE u.email = ? AND u.is_active = 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([$email]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Find user by email error: " . $e->getMessage());
            return false;
        }
    }

    // Find user by ID
    public function findById($id) {
        try {
            $query = "SELECT u.*, r.name as role_name 
                     FROM " . $this->table . " u 
                     LEFT JOIN roles r ON u.role_id = r.id 
                     WHERE u.id = ? AND u.is_active = 1";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Find user by ID error: " . $e->getMessage());
            return false;
        }
    }

    // Verify password
    public function verifyPassword($email, $password) {
        $user = $this->findByEmail($email);
        if ($user && password_verify($password, $user['password_hash'])) {
            return $user;
        }
        return false;
    }

    // Check if email exists
    public function emailExists($email) {
        try {
            $query = "SELECT id FROM " . $this->table . " WHERE email = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$email]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
        } catch (PDOException $e) {
            error_log("Email exists check error: " . $e->getMessage());
            return false;
        }
    }

    // Update last login
    public function updateLastLogin($id) {
        try {
            $query = "UPDATE " . $this->table . " SET last_login = NOW() WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            error_log("Update last login error: " . $e->getMessage());
            return false;
        }
    }

    // Get all users (admin only)
    public function getAll($limit = 100, $offset = 0) {
        try {
            $query = "SELECT u.id, u.first_name, u.last_name, u.email, u.phone, 
                            u.address, u.date_of_birth, u.is_active, u.email_verified, 
                            u.created_at, u.last_login, r.name as role_name
                     FROM " . $this->table . " u 
                     LEFT JOIN roles r ON u.role_id = r.id 
                     ORDER BY u.created_at DESC 
                     LIMIT ? OFFSET ?";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([$limit, $offset]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get all users error: " . $e->getMessage());
            return false;
        }
    }

    // Update user
    public function update($id, $data) {
        try {
            $fields = [];
            $values = [];
            
            $allowed_fields = ['first_name', 'last_name', 'phone', 'address', 'date_of_birth', 'role_id', 'is_active', 'email_verified'];
            
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    $fields[] = $field . " = ?";
                    $values[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                return false;
            }
            
            $values[] = $id;
            $query = "UPDATE " . $this->table . " SET " . implode(', ', $fields) . " WHERE id = ?";
            
            $stmt = $this->db->prepare($query);
            return $stmt->execute($values);
        } catch (PDOException $e) {
            error_log("Update user error: " . $e->getMessage());
            return false;
        }
    }

    // Delete user (soft delete by setting is_active to 0)
    public function delete($id) {
        try {
            $query = "UPDATE " . $this->table . " SET is_active = 0 WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            error_log("Delete user error: " . $e->getMessage());
            return false;
        }
    }

    // Get user count
    public function getCount() {
        try {
            $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE is_active = 1";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'];
        } catch (PDOException $e) {
            error_log("Get user count error: " . $e->getMessage());
            return 0;
        }
    }
}
