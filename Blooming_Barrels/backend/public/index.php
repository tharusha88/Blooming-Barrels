<?php

// Set up error handling and session
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-error.log');


// Include configuration and utilities
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/../utils/helpers.php';
require_once __DIR__ . '/../config/Database.php';

global $db;
$db = (new Database())->getConnection();

// Handle CORS and preflight requests FIRST
setCorsHeaders();
handlePreflightRequest();

// Start session
session_start();

// Rate limiting
$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$request_uri = getRequestUri();

// Increased rate limit: 1000 requests per hour per IP per endpoint
if (!checkRateLimit($client_ip, $request_uri, 1000, 3600)) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit();
}

// Basic routing
$method = getRequestMethod();
$uri = getRequestUri();

// Debug logging
error_log("Request URI: $uri");
error_log("Method: $method");

// Remove base path if needed (adjust this based on your setup)
$base_path = '/backend/public';
if (strpos($uri, $base_path) === 0) {
    $uri = substr($uri, strlen($base_path));
}

// Clean up URI
$uri = rtrim($uri, '/');
if (empty($uri)) {
    $uri = '/';
}

// Split URI into parts
$uri_parts = explode('/', trim($uri, '/'));

error_log("URI parts: " . json_encode($uri_parts));

try {
    // Route handling
    switch ($uri_parts[0]) {
        case '':
            // API root - show available endpoints
            echo json_encode([
                'message' => 'Blooming Barrel API',
                'version' => '1.0',
                'cors_test' => 'CORS is working!',
                'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'no-origin',
                'endpoints' => [
                    'POST /auth/register' => 'User registration',
                    'POST /auth/login' => 'User login',
                    'POST /auth/logout' => 'User logout',
                    'GET /auth/me' => 'Get current user',
                    'GET /users' => 'Get all users (admin only)',
                    'GET /products' => 'Get all products',
                    'GET /articles' => 'Get all articles'
                ]
            ]);
            break;
            
        case 'api':
            // Handle API routes with /api/ prefix
            $endpoint = $uri_parts[1] ?? '';
            handleApiRoute($endpoint, array_slice($uri_parts, 2), $method);
            break;
            
        case 'auth':
            // Handle direct auth routes (without /api/ prefix)
            handleAuthRoute($uri_parts[1] ?? '', $method);
            break;
            
        case 'admin':
            // Handle admin routes
            handleAdminRoute($uri_parts[1] ?? '', $method);
            break;
            
        case 'users':
            // Direct user routes
            requireAdmin();
            echo json_encode(['message' => 'User management endpoints coming soon']);
            break;
            
        case 'test':
            // Simple test endpoint for CORS
            echo json_encode([
                'message' => 'Test endpoint working!',
                'method' => $_SERVER['REQUEST_METHOD'],
                'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'no-origin',
                'headers' => getallheaders()
            ]);
            break;
            
        case 'products':
            // Product endpoints
            require_once __DIR__ . '/../controllers/ProductController.php';
            $productController = new ProductController($db);
            if ($method === 'GET') {
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
                $productController->getProducts($page);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case 'articles':
            // Article endpoints will be implemented here
            echo json_encode(['message' => 'Article endpoints coming soon']);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Route not found']);
            break;
    }
    
} catch (Exception $e) {
    logError("Router error: " . $e->getMessage(), [
        'uri' => $uri,
        'method' => $method,
        'trace' => $e->getTraceAsString()
    ]);
    
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}

// Helper function to handle auth routes
function handleAuthRoute($action, $method) {
    require_once __DIR__ . '/../controllers/AuthController.php';
    $authController = new AuthController();
    
    switch ($action) {
        case 'register':
            if ($method === 'POST') {
                $authController->register();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case 'login':
            if ($method === 'POST') {
                $authController->login();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case 'logout':
            if ($method === 'POST') {
                $authController->logout();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case 'me':
            if ($method === 'GET') {
                $authController->getCurrentUser();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Auth endpoint not found']);
            break;
    }
}

// Helper function to handle API routes with /api/ prefix
function handleApiRoute($endpoint, $remaining_parts, $method) {
    error_log("handleApiRoute: endpoint = " . print_r($endpoint, true));
    error_log("handleApiRoute: remaining_parts = " . print_r($remaining_parts, true));
    global $db;
    switch ($endpoint) {
        case 'user':
            require_once __DIR__ . '/../controllers/UserController.php';
            $userController = new UserController($db);
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Not authenticated']);
                return;
            }
            $user_id = $_SESSION['user_id'];
            if ($method === 'GET') {
                $userController->getCurrentUser($user_id);
            } elseif ($method === 'PUT') {
                $data = json_decode(file_get_contents('php://input'), true);
                // If changing password, use /api/user/password
                if (!empty($remaining_parts[0]) && $remaining_parts[0] === 'password') {
                    $old_password = $data['old_password'] ?? '';
                    $new_password = $data['new_password'] ?? '';
                    $userController->changePassword($user_id, $old_password, $new_password);
                } else {
                    $userController->updateUser($user_id, $data);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
        }
    error_log("handleApiRoute: endpoint = " . print_r($endpoint, true));
    error_log("handleApiRoute: remaining_parts = " . print_r($remaining_parts, true));
    global $db;
    switch ($endpoint) {
        case 'checkout':
            // Checkout route
            require_once __DIR__ . '/../controllers/OrderController.php';
            if ($method === 'POST') {
                if (!isset($_SESSION['user_id'])) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Not authenticated']);
                    return;
                }
                $data = json_decode(file_get_contents("php://input"), true);
                $user_id = $_SESSION['user_id'];
                $items = $data['items'] ?? [];
                $total = $data['total'] ?? 0;
                $orderController = new OrderController($db);
                $orderController->checkout($user_id, $items, $total);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
        case 'article_categories':
            // Serve article categories
            require __DIR__ . '/../routes/categoryRoutes.php';
            break;
        case 'products':
            error_log('handleApiRoute: entered products case');
            require_once __DIR__ . '/../controllers/ProductController.php';
            if (!isset($db)) {
                error_log('handleApiRoute: $db is not set!');
            }
            $productController = new ProductController($db);
            if ($method === 'GET') {
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
                error_log('handleApiRoute: calling getProducts with page=' . $page);
                $productController->getProducts($page);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
        case 'cart':
            // Cart routes
            require_once __DIR__ . '/../controllers/CartController.php';
            $cartController = new CartController($db);
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Not authenticated']);
                return;
            }
            $user_id = $_SESSION['user_id'];
            if ($method === 'GET') {
                $cartController->getCart($user_id);
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents("php://input"), true);
                $cartController->addToCart($user_id, $data['product_id'], $data['quantity']);
            } elseif ($method === 'DELETE') {
                $product_id = $remaining_parts[0] ?? '';
                $cartController->removeFromCart($user_id, $product_id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        case 'wishlist':
            // Wishlist routes
            require_once __DIR__ . '/../controllers/WishlistController.php';
            $wishlistController = new WishlistController($db);
            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Not authenticated']);
                return;
            }
            $user_id = $_SESSION['user_id'];
            if ($method === 'GET') {
                $wishlistController->getWishlist($user_id);
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents("php://input"), true);
                $wishlistController->addToWishlist($user_id, $data['product_id']);
            } elseif ($method === 'DELETE') {
                $product_id = $remaining_parts[0] ?? '';
                $wishlistController->removeFromWishlist($user_id, $product_id);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        case 'articles':
            require_once __DIR__ . '/../controllers/ArticleController.php';
            $articleController = new ArticleController();

            if ($method === 'GET') {
                if (!empty($remaining_parts[0])) {
                    $articleId = intval($remaining_parts[0]);
                    echo json_encode($articleController->getOne($articleId));
                } else {
                    echo json_encode($articleController->getAll());
                }
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents("php://input"), true);
                echo json_encode(['success' => $articleController->create($data)]);
            } elseif ($method === 'PUT') {
                if (!empty($remaining_parts[0])) {
                    $articleId = intval($remaining_parts[0]);
                    $data = json_decode(file_get_contents("php://input"), true);
                    echo json_encode(['success' => $articleController->update($articleId, $data)]);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Article ID required']);
                }
            } elseif ($method === 'DELETE') {
                if (!empty($remaining_parts[0])) {
                    $articleId = intval($remaining_parts[0]);
                    echo json_encode(['success' => $articleController->delete($articleId)]);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Article ID required']);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'API endpoint not found']);
            break;
    }
}

// Helper function to handle admin routes
function handleAdminRoute($action, $method) {
    require_once __DIR__ . '/../controllers/AdminController.php';
    require_once __DIR__ . '/../controllers/RoleController.php';
    $adminController = new AdminController();
    
    switch ($action) {
        case 'stats':
            if ($method === 'GET') {
                $adminController->getStats();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case 'activity':
            if ($method === 'GET') {
                $adminController->getRecentActivity();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        case 'users':
            if ($method === 'GET') {
                $adminController->getUsers();
            } else if ($method === 'POST') {
                $adminController->createUser();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        case 'user':
            $uri = $_SERVER['REQUEST_URI'];
            $path = parse_url($uri, PHP_URL_PATH);
            $segments = explode('/', trim($path, '/'));
            
            if (count($segments) >= 3 && is_numeric($segments[2])) {
                $userId = intval($segments[2]);
                
                if ($method === 'PUT') {
                    $adminController->updateUser($userId);
                } else if ($method === 'DELETE') {
                    $adminController->deleteUser($userId);
                } else {
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid user ID']);
            }
            break;

        case 'roles':
            $roleController = new RoleController();
            
            if ($method === 'GET') {
                $roleController->getRoles();
            } else if ($method === 'POST') {
                $roleController->createRole();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Admin endpoint not found']);
            break;
    }
}

