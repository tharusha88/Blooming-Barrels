<?php
class Order {
    private $db;
    public function __construct($db) {
        $this->db = $db;
    }
    public function createOrder($user_id, $items, $total) {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, 'pending', NOW())");
            $stmt->execute([$user_id, $total]);
            $order_id = $this->db->lastInsertId();
            $itemStmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            foreach ($items as $item) {
                $itemStmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
                $updateStock = $this->db->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
                $updateStock->execute([$item['quantity'], $item['product_id']]);
            }
            $this->db->commit();
            return $order_id;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
