<?php
require_once __DIR__ . '/../controllers/ArticleController.php';

$controller = new ArticleController();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$path = $_GET['path'] ?? '';

header("Content-Type: application/json");

switch ($requestMethod) {
    case 'GET':
        if (isset($_GET['id'])) {
            echo json_encode($controller->getOne($_GET['id']));
        } else {
            echo json_encode($controller->getAll());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode(['success' => $controller->create($data)]);
        break;

    case 'PUT':
        parse_str(file_get_contents("php://input"), $putData);
        echo json_encode(['success' => $controller->update($_GET['id'], $putData)]);
        break;

    case 'DELETE':
        echo json_encode(['success' => $controller->delete($_GET['id'])]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
        break;
}
