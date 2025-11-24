
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Adoption from './components/adoption';
import Category from './components/category';
import Kit from './components/Kit';
import FeedbackAndContact from './components/Feedback';
import Cart from './components/Cart';
import Upload from './components/Upload';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/category" element={<Category />} />
          <Route path="/kit" element={<Kit addToCart={addToCart} cartCount={cartItems.length} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="/feedback" element={<FeedbackAndContact />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
