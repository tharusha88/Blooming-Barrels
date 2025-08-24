<?php
// Route to get current user details (GET /api/user)
$app->get('/api/user', function($request, $response) {
    $user_id = $_SESSION['user_id'];  // Assuming user ID is stored in session
    $controller = new UserController();
    return $controller->getCurrentUser($user_id);
});

// Route to update user details (PUT /api/user/{user_id})
$app->put('/api/user/{user_id}', function($request, $response, $args) {
    // Get user data from request body
    $data = $request->getParsedBody();
    $user_id = $args['user_id'];  // Get user_id from URL parameters
    $controller = new UserController();
    return $controller->updateUser($user_id, $data);
});

// Route to change password (PUT /api/user/password)
$app->put('/api/user/password', function($request, $response) {
    $data = $request->getParsedBody();
    $user_id = $_SESSION['user_id'];  // Assuming user_id is stored in session
    return (new UserController())->changePassword($user_id, $data['old_password'], $data['new_password']);
});
