<?php
require_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json");

$database = new Database();
$conn = $database->getConnection();

// GET /api/article_categories
$query = "SELECT id, name FROM article_categories WHERE is_active = 1 ORDER BY name ASC";
$stmt = $conn->prepare($query);
$stmt->execute();
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
