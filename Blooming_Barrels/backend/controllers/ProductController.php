<?php
require_once __DIR__ . '/../models/Product.php';

class ProductController {
  private $productModel;

  public function __construct($db) {
    $this->productModel = new Product($db);
  }

  public function getProducts($page = 1) {
    $limit = 10;
    $products = $this->productModel->getAll($page, $limit);
    $totalPages = $this->productModel->getTotalPages($limit);
    $totalProducts = count($products);
    echo json_encode([
      'success' => true,
      'products' => $products,
      'totalProducts' => $totalProducts,
      'totalPages' => $totalPages
    ]);
  }
}
