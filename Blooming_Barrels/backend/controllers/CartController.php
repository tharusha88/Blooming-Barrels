<?php
// backend/controllers/CartController.php
require_once __DIR__ . '/../models/Cart.php';

class CartController {
  private $cartModel;

  public function __construct($db) {
    $this->cartModel = new Cart($db);
  }

  public function addToCart($user_id, $product_id, $quantity) {
    $this->cartModel->addToCart($user_id, $product_id, $quantity);
  }

  public function removeFromCart($user_id, $product_id) {
    $this->cartModel->removeFromCart($user_id, $product_id);
  }

  public function getCart($user_id) {
    $cartItems = $this->cartModel->getUserCart($user_id);
    echo json_encode($cartItems);
  }
}
