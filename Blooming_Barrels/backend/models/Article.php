<?php
require_once __DIR__ . '/../config/database.php';

class Article {
    private $conn;
    private $table = "articles";

    public function __construct($db) {
        $this->conn = $db;
    }

    // ✅ Create Article
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (title, content, excerpt, author_id, category_id, status, featured_image, publish_date, created_at, updated_at, views_count, rating_average, rating_count, published_at) 
                  VALUES (:title, :content, :excerpt, :author_id, :category_id, :status, :featured_image, :publish_date, :created_at, :updated_at, :views_count, :rating_average, :rating_count, :published_at)";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':excerpt' => $data['excerpt'] ?? '',
            ':author_id' => $data['author_id'],
            ':category_id' => $data['category_id'] ?? 1,
            ':status' => $data['status'] ?? 'draft',
            ':featured_image' => $data['featured_image'] ?? '',
            ':publish_date' => $data['publish_date'] ?? null,
            ':created_at' => date('Y-m-d H:i:s'),
            ':updated_at' => date('Y-m-d H:i:s'),
            ':views_count' => 0,
            ':rating_average' => 0.00,
            ':rating_count' => 0,
            ':published_at' => $data['published_at'] ?? null
        ]);
    }

    // Read all articles with category name
public function readAll() {
    $query = "SELECT a.*, c.name AS category_name 
              FROM " . $this->table . " a
              LEFT JOIN article_categories c ON a.category_id = c.id
              ORDER BY a.created_at DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
    // Read single article with category name
public function readOne($id) {
    $query = "SELECT a.*, c.name AS category_name
              FROM " . $this->table . " a
              LEFT JOIN article_categories c ON a.category_id = c.id
              WHERE a.id = :id LIMIT 1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([':id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

    // ✅ Update article
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET title=:title, content=:content, excerpt=:excerpt, category_id=:category_id, 
                      status=:status, featured_image=:featured_image, publish_date=:publish_date, 
                      updated_at=:updated_at, views_count=:views_count, rating_average=:rating_average, rating_count=:rating_count, published_at=:published_at 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':excerpt' => $data['excerpt'] ?? '',
            ':category_id' => $data['category_id'] ?? 1,
            ':status' => $data['status'] ?? 'draft',
            ':featured_image' => $data['featured_image'] ?? '',
            ':publish_date' => $data['publish_date'] ?? null,
            ':updated_at' => date('Y-m-d H:i:s'),
            ':views_count' => $data['views_count'] ?? 0,
            ':rating_average' => $data['rating_average'] ?? 0.00,
            ':rating_count' => $data['rating_count'] ?? 0,
            ':published_at' => $data['published_at'] ?? null
        ]);
    }

    // ✅ Delete article
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':id' => $id]);
    }
}
