<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthController {
    private $user;
    private $validator;

    public function __construct() {
        // Set CORS headers
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        
        $this->user = new User();
        $this->validator = new Validator();
    }


    // User registration
    public function register() {
        try {
            // Ensure CORS headers are set
            setCorsHeaders();
            
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::json(['success' => false, 'error' => 'Invalid JSON input'], 400);
                return;
            }

            // Validate input
            $this->validator
                ->validateRequired($input['first_name'] ?? '', 'first_name')
                ->validateRequired($input['last_name'] ?? '', 'last_name')
                ->validateEmail($input['email'] ?? '')
                ->validatePassword($input['password'] ?? '');

            if ($this->validator->hasErrors()) {
                Response::json(['success' => false, 'error' => 'Validation failed', 'errors' => $this->validator->getErrors()], 422);
                return;
            }

            // Check if email already exists
            if ($this->user->emailExists($input['email'])) {
                Response::json(['success' => false, 'error' => 'Email already exists'], 409);
                return;
            }

            // Debug log the input data
            error_log('Registration input data: ' . print_r($input, true));
            
            // Create user with role_id from request if provided
            $role_id = $input['role_id'] ?? DEFAULT_ROLE_ID;
            error_log('Using role_id: ' . $role_id . ' (Type: ' . gettype($role_id) . ')');
            
            $userData = [
                'first_name' => $input['first_name'],
                'last_name' => $input['last_name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'phone' => $input['phone'] ?? null,
                'address' => $input['address'] ?? null,
                'date_of_birth' => $input['date_of_birth'] ?? $input['dob'] ?? null,
                'role_id' => $role_id
            ];
            
            error_log('User data being saved: ' . print_r($userData, true));

            $userId = $this->user->create($userData);
            
            if ($userId) {
                // Get the created user with role information
                $newUser = $this->user->findById($userId);
                if (!$newUser) {
                    throw new Exception('User created but could not be retrieved');
                }
                
                // Start session and set user data
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                
                $_SESSION['user_id'] = $newUser['id'];
                $_SESSION['user_email'] = $newUser['email'];
                $_SESSION['user_role'] = $newUser['role_name'];
                $_SESSION['user_name'] = $newUser['first_name'] . ' ' . $newUser['last_name'];
                // Log the session id before regenerating
                $old_session_id = session_id();
                error_log('REGISTER SESSION (before regenerate): ' . $old_session_id . ' user_id=' . $_SESSION['user_id']);
                // Regenerate session id to avoid stale or hijacked sessions and force a Set-Cookie
                session_regenerate_id(true);
                $new_session_id = session_id();
                error_log('REGISTER SESSION (after regenerate): ' . $new_session_id . ' user_id=' . $_SESSION['user_id']);
                // Log session cookie settings to help debug cross-origin cookie issues
                $session_cookie_params = session_get_cookie_params();
                error_log('SESSION COOKIE PARAMS: ' . json_encode($session_cookie_params));

                Response::json([
                    'success' => true,
                    'message' => 'User registered successfully',
                    'user' => [
                        'id' => $newUser['id'],
                        'first_name' => $newUser['first_name'],
                        'last_name' => $newUser['last_name'],
                        'email' => $newUser['email'],
                        'role' => $newUser['role_name']
                    ]
                ], 201);
            } else {
                Response::json(['success' => false, 'error' => 'Registration failed'], 500);
            }
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    // User login
    public function login() {
        try {
            // Ensure CORS headers are set
            setCorsHeaders();
            
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                Response::json(['success' => false, 'error' => 'Invalid JSON input'], 400);
                return;
            }

            // Validate input
            $this->validator
                ->validateEmail($input['email'] ?? '')
                ->validateRequired($input['password'] ?? '', 'password');

            if ($this->validator->hasErrors()) {
                Response::json(['success' => false, 'error' => 'Validation failed', 'errors' => $this->validator->getErrors()], 422);
                return;
            }

            // Verify credentials
            $user = $this->user->verifyPassword($input['email'], $input['password']);
            
            if ($user) {
                // Update last login
                $this->user->updateLastLogin($user['id']);
                
                // Start session and set user data
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role_name'];
                $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
                // Log the session id before regenerating
                $old_session_id = session_id();
                error_log('LOGIN SESSION (before regenerate): ' . $old_session_id . ' user_id=' . $_SESSION['user_id']);

                // Regenerate session id to avoid stale or hijacked sessions and force a Set-Cookie
                session_regenerate_id(true);
                $new_session_id = session_id();
                error_log('LOGIN SESSION (after regenerate): ' . $new_session_id . ' user_id=' . $_SESSION['user_id']);

                // Log session cookie settings to help debug cross-origin cookie issues
                $session_cookie_params = session_get_cookie_params();
                error_log('SESSION COOKIE PARAMS: ' . json_encode($session_cookie_params));

                // Prepare user data for response
                $userData = [
                    'id' => $user['id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'email' => $user['email'],
                    'role' => [
                        'id' => $user['role_id'],
                        'name' => strtolower(str_replace(' ', '_', $user['role_name']))
                    ],
                    'role_name' => $user['role_name'],
                    'role_id' => $user['role_id']
                ];

                Response::json([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => $userData
                ]);
            } else {
                Response::json(['success' => false, 'error' => 'Invalid credentials'], 401);
            }
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            Response::json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    // User logout
    public function logout() {
        try {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            // Destroy session
            session_destroy();
            
            Response::json(['message' => 'Logout successful']);
        } catch (Exception $e) {
            error_log("Logout error: " . $e->getMessage());
            Response::json(['error' => 'Internal server error'], 500);
        }
    }

    // Get current user
    public function getCurrentUser() {
        try {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            if (!isset($_SESSION['user_id'])) {
                Response::json(['error' => 'Not authenticated'], 401);
                return;
            }

            $user = $this->user->findById($_SESSION['user_id']);
            
            if ($user) {
                Response::json([
                    'user' => [
                        'id' => $user['id'],
                        'first_name' => $user['first_name'],
                        'last_name' => $user['last_name'],
                        'email' => $user['email'],
                        'role' => $user['role_name'],
                        'phone' => $user['phone'],
                        'address' => $user['address'],
                        'city' => $user['city'],
                        'state' => $user['state'],
                        'zip_code' => $user['zip_code']
                    ]
                ]);
            } else {
                Response::json(['error' => 'User not found'], 404);
            }
        } catch (Exception $e) {
            error_log("Get current user error: " . $e->getMessage());
            Response::json(['error' => 'Internal server error'], 500);
        }
    }

    // Check authentication status
    public function checkAuth() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        return isset($_SESSION['user_id']);
    }

    // Get user role
    public function getUserRole() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        return $_SESSION['user_role'] ?? null;
    }

    // Check if user is admin
    public function isAdmin() {
        return $this->getUserRole() === 'admin';
    }
}
