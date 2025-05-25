import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      await axios.post('http://localhost:5000/api/v1/register', userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  const forgotPassword = async (email) => {
    setAuthLoading(true);
    try {
      await axios.post('http://localhost:5000/api/v1/users/forgetPassword', { email });
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to process request';
      toast.error(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authLoading,
      login,
      register,
      logout,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 