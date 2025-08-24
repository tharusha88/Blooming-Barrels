<?php
require_once __DIR__ . '/../models/User.php';

class UserController {
    private $userModel;

    public function __construct($db = null) {
        $this->userModel = new User();
    }

    // Get current user details
    public function getCurrentUser($user_id) {
        $user = $this->userModel->getById($user_id);
        if ($user) {
            unset($user['password']);  // Don't send sensitive data like password
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
    }

    // Update user details
    public function updateUser($user_id, $data) {
        $result = $this->userModel->update($user_id, $data);
        if ($result) {
            // Fetch updated user
            $user = $this->userModel->getById($user_id);
            if ($user) {
                unset($user['password']);
            }
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Failed to update user']);
        }
    }

    // Change password
    public function changePassword($user_id, $old_password, $new_password) {
        $result = $this->userModel->changePassword($user_id, $old_password, $new_password);
        if ($result === true) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $result]);
        }
    }
}
?>
