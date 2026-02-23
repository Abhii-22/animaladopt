import React, { createContext, useState, useContext, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signin = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.token);
        setCurrentUser(data.data.user);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Sign up function
  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Don't set user and token yet - wait for email verification
        return data;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.token);
        setCurrentUser(data.data.user);
        return data;
      } else {
        throw new Error(data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  // Resend verification OTP function
  const resendVerificationOTP = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  // Sign out function
  const signout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signin,
    signup,
    verifyEmail,
    resendVerificationOTP,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
