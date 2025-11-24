import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Kit.css';


const Kit = ({ addToCart, cartCount }) => {
  const navigate = useNavigate();
  const [kitProducts, setKitProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/kits')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched kit products:', data);
        setKitProducts(data);
      })
      .catch(error => console.error('Error fetching kit products:', error));
  }, []);
  return (
    <div className="kit-container">
      <header className="kit-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Adoption Kits & Food</h1>
        <p>Everything you need to welcome your new friend home.</p>
                <button className="cart-icon-btn" onClick={() => navigate('/cart')}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </header>
      <main className="kit-grid">
        {kitProducts.map((product, index) => (
          <div className="kit-card" key={product._id || index}>
            <img src={product.image} alt={product.name} className="kit-image" />
            <div className="kit-card-content">
              <h3 className="kit-name">{product.name}</h3>
              <p className="kit-description">{product.description}</p>
              <div className="kit-card-footer">
                <span className="kit-price">{product.price} Rs</span>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                <button className="contact-btn" onClick={() => navigate('/feedback#contact-section')}>Contact</button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Kit;