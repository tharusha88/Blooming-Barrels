<?php
require_once __DIR__ . '/../models/Order.php';
class OrderController {
    private $orderModel;
    public function __construct($db) {
        $this->orderModel = new Order($db);
    }
    public function checkout($user_id, $items, $total) {
        $order_id = $this->orderModel->createOrder($user_id, $items, $total);
        echo json_encode(['success' => true, 'order_id' => $order_id]);
    }
}
