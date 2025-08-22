<?php
class Wishlist {
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  public function getUserWishlist($user_id) {
    $stmt = $this->db->prepare("SELECT * FROM wishlist WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function addToWishlist($user_id, $product_id) {
    $stmt = $this->db->prepare("INSERT INTO wishlist (user_id, product_id) VALUES (:user_id, :product_id)");
    $stmt->execute(['user_id' => $user_id, 'product_id' => $product_id]);
  }

  public function removeFromWishlist($user_id, $product_id) {
    $stmt = $this->db->prepare("DELETE FROM wishlist WHERE user_id = :user_id AND product_id = :product_id");
    $stmt->execute(['user_id' => $user_id, 'product_id' => $product_id]);
  }
}
