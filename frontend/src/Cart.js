import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:4000/getAllCartItems');
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        item.quantity = newQuantity;
        item.subtotal = item.price * newQuantity;
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:4000/deleteCartItem/${itemId}`);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);




  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container my-5">
      <h2>Your Cart</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody data-testid="cart-table">
          {cartItems.map((item) => (
            <tr key={item.id} data-testid={`cart-item-${item.id}`}>
              <td>{item.product_name}</td>
              <td>
            <select
              value={item.quantity}
              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>{num + 1}</option>
              ))}
            </select>
          </td>
              <td>₹{item.price}</td>
              <td>₹{item.subtotal}</td>
              <td>
                <button
                  onClick={(e) => handleRemoveItem(item.id)}
                  className="btn btn-danger"
                  style={{ backgroundColor: 'green', color: 'white' }}
                  data-testid="btn-danger"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end pb-3">
        <h4>Total: ₹{total}</h4>
      </div>
    </div>
  );
}

export default Cart;





