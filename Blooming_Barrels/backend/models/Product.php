<?php
class Product {
  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  public function getAll($page = 1, $limit = 10) {
  $offset = ($page - 1) * $limit;
  $stmt = $this->db->prepare("SELECT * FROM products LIMIT :limit OFFSET :offset");
  $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
  $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
  $stmt->execute();
  $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // For each product, fetch images from product_images table
  foreach ($products as &$product) {
    // Fetch images for this product
    $imgStmt = $this->db->prepare("SELECT image_url, image_order FROM product_images WHERE product_id = ? ORDER BY image_order ASC, id ASC");
    $imgStmt->execute([$product['id']]);
    $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);
    // Normalize image URLs
    foreach ($images as &$img) {
      if (!empty($img['image_url']) && strpos($img['image_url'], 'http') !== 0 && strpos($img['image_url'], '/images/') !== 0) {
        $img['url'] = '/images/' . ltrim($img['image_url'], '/');
      } else {
        $img['url'] = $img['image_url'];
      }
      unset($img['image_url']);
    }
    unset($img);
    $product['images'] = $images;

    // If image_url is set, prepend /images/ if not already a full URL
    if (!empty($product['image_url'])) {
      if (strpos($product['image_url'], 'http') === 0 || strpos($product['image_url'], '/uploads/') === 0 || strpos($product['image_url'], '/images/') === 0) {
        $product['image_url'] = $product['image_url'];
      } else {
        $product['image_url'] = '/images/' . ltrim($product['image_url'], '/');
      }
    } else {
      $product['image_url'] = '';
    }
    // Ensure price is always present
    if (!isset($product['price'])) {
      $product['price'] = 0.00;
    }
  }
  unset($product);
  return $products;
  }

  public function getTotalPages($limit = 10) {
    $stmt = $this->db->query("SELECT COUNT(*) FROM products");
    $totalCount = $stmt->fetchColumn();
    return ceil($totalCount / $limit);
  }
}
