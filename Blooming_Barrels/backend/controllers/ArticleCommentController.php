<?php
require_once __DIR__ . '/../models/ArticleComment.php';
require_once __DIR__ . '/../models/User.php';

class ArticleCommentController {
    private $db;
    public function __construct($db) {
        $this->db = $db;
    }

    // GET /api/article/{articleId}/comments
    public function getComments($articleId) {
        $commentModel = new ArticleComment($this->db);
        $comments = $commentModel->getCommentsByArticle($articleId);
        header('Content-Type: application/json');
        echo json_encode($comments);
    }

    // POST /api/article/{articleId}/comments
    public function addComment($articleId) {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Not logged in']);
            return;
        }
        $userId = $_SESSION['user_id'];
        $data = json_decode(file_get_contents('php://input'), true);
        $content = trim($data['content'] ?? '');
        $parentId = $data['parent_id'] ?? null;
        if ($content === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Empty comment']);
            return;
        }
        $commentModel = new ArticleComment($this->db);
        $id = $commentModel->addComment($articleId, $userId, $content, $parentId);
        $comment = $commentModel->getCommentWithUser($id);
        header('Content-Type: application/json');
        echo json_encode($comment);
    }
}
