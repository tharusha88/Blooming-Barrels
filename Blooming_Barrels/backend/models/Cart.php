<?php
class Cart {
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  public function getUserCart($user_id) {
    $stmt = $this->db->prepare("SELECT c.*, p.name as product_name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function addToCart($user_id, $product_id, $quantity) {
    $stmt = $this->db->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)");
    $stmt->execute(['user_id' => $user_id, 'product_id' => $product_id, 'quantity' => $quantity]);
  }

  public function removeFromCart($user_id, $product_id) {
    $stmt = $this->db->prepare("DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id");
    $stmt->execute(['user_id' => $user_id, 'product_id' => $product_id]);
  }

  public function updateCartItem($user_id, $product_id, $quantity) {
    $stmt = $this->db->prepare("UPDATE cart SET quantity = :quantity WHERE user_id = :user_id AND product_id = :product_id");
    $stmt->execute(['quantity' => $quantity, 'user_id' => $user_id, 'product_id' => $product_id]);
  }
}
