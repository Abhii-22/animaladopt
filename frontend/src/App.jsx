import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Home from './components/home';
import Adoption from './components/adoption';
import Category from './components/category';
import Kit from './components/Kit';
import FeedbackAndContact from './components/Feedback';
import Cart from './components/Cart';
import Upload from './components/Upload';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/profile/Profile';
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
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/category" element={<Category />} />
          <Route path="/kit" element={<Kit addToCart={addToCart} cartCount={cartItems.length} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="/feedback" element={<FeedbackAndContact />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
