<?php

class OrderHistory
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // Fetch all orders for a user, including items and product details
    public function getOrdersByUserId($user_id)
    {
        // Fetch orders
        $stmt = $this->db->prepare("
            SELECT id, user_id, status, total, created_at, updated_at
            FROM order_history
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        ");
        $stmt->execute(['user_id' => $user_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // For each order, fetch items and product details
        foreach ($orders as &$order) {
            $itemStmt = $this->db->prepare("
                SELECT oi.product_id, oi.quantity, oi.price,
                       p.name, p.price AS product_price, p.image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = :order_id
            ");
            $itemStmt->execute(['order_id' => $order['id']]);
            $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
        }
        unset($order);
        return $orders;
    }
}
