import React from 'react';
import API_BASE_URL from '../config/api';
import './Cart.css';

const Cart = ({ cartItems = [], removeFromCart }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Convert backslashes to forward slashes and remove leading slash if present
    const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    return `${API_BASE_URL}/${normalizedPath}`;
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={getImageUrl(item.image)} alt={item.name} className="cart-item-image" />
                              <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  <div className="payment-option">
                    <input type="radio" id={`cod-${index}`} name={`payment-${index}`} value="cod" defaultChecked />
                    <label htmlFor={`cod-${index}`}>Cash on Delivery</label>
                  </div>
                  <button className="order-now-btn">Order Now</button>
                  <button className="remove-btn" onClick={() => removeFromCart(index)}>Remove</button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
