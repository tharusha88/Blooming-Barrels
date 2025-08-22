<?php
require_once __DIR__ . '/../config/constants.php';
// If using firebase/php-jwt or similar, require it here
// require_once __DIR__ . '/../vendor/autoload.php';

function getBearerToken() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if (!isset($headers['Authorization'])) return null;
    if (preg_match('/Bearer\s(.*)/', $headers['Authorization'], $matches)) {
        return $matches[1];
    }
    return null;
}

function currentUser() {
    $token = getBearerToken();
    if (!$token) return null;
    try {
        // Replace with your JWT decode logic
        $payload = JWT::decode($token, JWT_SECRET, ['HS256']);
        return [
            'id' => $payload->sub,
            'role' => $payload->role
        ];
    } catch (Exception $e) {
        return null;
    }
}

function requireAuth() {
    $user = currentUser();
    if (!$user) {
        jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);
        exit;
    }
    return $user;
}

function hasRole($user, $role) {
    return isset($user['role']) && $user['role'] === $role;
}

function isAdmin($user) {
    return hasRole($user, 'admin');
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
