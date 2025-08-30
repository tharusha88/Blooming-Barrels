<?php
class ArticleComment {
    private $db;
    public function __construct($db) {
        $this->db = $db;
    }

    public function getCommentsByArticle($articleId) {
        $sql = "SELECT ac.*, u.name as user_name FROM article_comments ac JOIN users u ON ac.user_id = u.id WHERE ac.article_id = ? AND ac.status = 'visible' ORDER BY ac.created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$articleId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addComment($articleId, $userId, $content, $parentId = null) {
        $sql = "INSERT INTO article_comments (article_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$articleId, $userId, $parentId, $content]);
        return $this->db->lastInsertId();
    }

    public function getCommentWithUser($id) {
        $sql = "SELECT ac.*, u.name as user_name FROM article_comments ac JOIN users u ON ac.user_id = u.id WHERE ac.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
