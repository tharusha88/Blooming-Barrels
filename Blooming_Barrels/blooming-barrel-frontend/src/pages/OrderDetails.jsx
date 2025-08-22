import React, { useEffect, useState } from 'react';

export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      const res = await fetch(`http://localhost/backend-php/controllers/OrderController.php?order_id=${orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setItems(data.items);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      <p>Total: Rs {order.total}</p>
      <h3>Items:</h3>
      <ul>
        {items.map(item => (
          <li key={item.product_id}>
            {item.product_name} (x{item.quantity}) - Rs {item.price} each, Subtotal: Rs {item.subtotal}
          </li>
        ))}
      </ul>
    </div>
  );
} 