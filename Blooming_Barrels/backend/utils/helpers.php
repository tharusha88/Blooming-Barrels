<?php

// CORS Headers
function setCorsHeaders() {
    $allowed_origins = CORS_ALLOWED_ORIGINS;
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Always allow localhost:5174 for development
    if ($origin === 'http://localhost:5174' || in_array($origin, $allowed_origins) || in_array('*', $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // Default to localhost:5174 if no origin header
        header("Access-Control-Allow-Origin: http://localhost:5174");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours
}

// Handle preflight OPTIONS requests
function handlePreflightRequest() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        http_response_code(200);
        exit();
    }
}

// Require authentication
function requireAuth() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }
}

// Require admin role
function requireAdmin() {
    requireAuth();
    
    if ($_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit();
    }
}

// Get request method
function getRequestMethod() {
    return $_SERVER['REQUEST_METHOD'];
}

// Get request URI
function getRequestUri() {
    return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
}

// Get JSON input
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// Log error
function logError($message, $context = []) {
    $log_message = date('Y-m-d H:i:s') . " - " . $message;
    if (!empty($context)) {
        $log_message .= " - Context: " . json_encode($context);
    }
    error_log($log_message);
}

// Sanitize input
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Format user data for response
function formatUserData($user) {
    return [
        'id' => $user['id'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email'],
        'role' => $user['role_name'],
        'phone' => $user['phone'],
        'address' => $user['address'],
        'date_of_birth' => $user['date_of_birth'],
        'is_active' => $user['is_active'],
        'email_verified' => $user['email_verified'],
        'created_at' => $user['created_at'],
        'last_login' => $user['last_login']
    ];
}

// Rate limiting (simple implementation)
function checkRateLimit($ip, $endpoint, $limit = 100, $window = 3600) {
    // This is a basic implementation - in production you'd use Redis or a proper rate limiting service
    $cache_file = __DIR__ . '/../logs/rate_limit_' . md5($ip . $endpoint) . '.txt';
    
    $current_time = time();
    $requests = [];
    
    if (file_exists($cache_file)) {
        $data = file_get_contents($cache_file);
        $requests = json_decode($data, true) ?: [];
    }
    
    // Remove old requests outside the window
    $requests = array_filter($requests, function($timestamp) use ($current_time, $window) {
        return ($current_time - $timestamp) < $window;
    });
    
    // Check if limit exceeded
    if (count($requests) >= $limit) {
        return false;
    }
    
    // Add current request
    $requests[] = $current_time;
    
    // Save updated requests
    file_put_contents($cache_file, json_encode($requests));
    
    return true;
}

// Generate random string
function generateRandomString($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

// Validate image upload
function validateImageUpload($file) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['error' => 'Upload failed'];
    }
    
    if ($file['size'] > $max_size) {
        return ['error' => 'File too large. Maximum size is 5MB'];
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_types)) {
        return ['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'];
    }
    
    return ['success' => true];
}
