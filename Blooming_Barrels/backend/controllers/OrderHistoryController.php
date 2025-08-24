<?php
require_once __DIR__ . '/../models/OrderHistory.php';

class OrderHistoryController {
	private $orderHistory;

	public function __construct($db) {
		$this->orderHistory = new OrderHistory($db);
	}

	public function getUserOrders($user_id) {
		$orders = $this->orderHistory->getOrdersByUserId($user_id);
		echo json_encode($orders);
	}
}
