<?php
// backend/controllers/WishlistController.php
require_once __DIR__ . '/../models/Wishlist.php';

class WishlistController {
  private $wishlistModel;

  public function __construct($db) {
    $this->wishlistModel = new Wishlist($db);
  }


  public function addToWishlist($user_id, $product_id) {
    try {
      $this->wishlistModel->addToWishlist($user_id, $product_id);
      echo json_encode(['success' => true]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
  }


  public function removeFromWishlist($user_id, $product_id) {
    try {
      $this->wishlistModel->removeFromWishlist($user_id, $product_id);
      echo json_encode(['success' => true]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
  }

  public function getWishlist($user_id) {
    $wishlistItems = $this->wishlistModel->getUserWishlist($user_id);
    echo json_encode($wishlistItems);
  }
}
