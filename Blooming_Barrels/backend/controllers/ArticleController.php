<?php
require_once __DIR__ . '/../models/Article.php';
require_once __DIR__ . '/../config/database.php';

class ArticleController {
    private $article;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->article = new Article($db);
    }

    public function getAll() {
        return $this->article->readAll();
    }

    public function getOne($id) {
        return $this->article->readOne($id);
    }

    public function create($data) {
        return $this->article->create($data);
    }

    public function update($id, $data) {
        return $this->article->update($id, $data);
    }

    public function delete($id) {
        return $this->article->delete($id);
    }
}
