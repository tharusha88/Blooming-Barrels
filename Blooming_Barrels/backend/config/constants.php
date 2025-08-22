<?php

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'blooming_barrels');
define('DB_USER', 'root');
define('DB_PASS', '');

// Application Configuration
define('APP_NAME', 'Blooming Barrels');
define('APP_VERSION', '1.0.0');
define('APP_DEBUG', true);

// JWT Configuration (for future use)
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
define('JWT_EXPIRY', 86400); // 24 hours

// CORS Configuration
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
]);

// Session Configuration
define('SESSION_LIFETIME', 7200); // 2 hours

// File Upload Configuration
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'gif']);

// Error Logging
define('LOG_ERRORS', true);
define('LOG_FILE', __DIR__ . '/../logs/error.log');

// Security
define('BCRYPT_COST', 12);
define('PASSWORD_MIN_LENGTH', 6);
define('DEFAULT_ROLE_ID', 2); // Customer role ID
