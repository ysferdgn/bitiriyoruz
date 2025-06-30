import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { auth } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [savedPets, setSavedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.savedPets) {
        setSavedPets(parsedUser.savedPets);
      }
    }
    setLoading(false);
  }, []);

  const updateUserInContext = (userData) => {
    setUser(userData);
    setSavedPets(userData.savedPets || []);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      
      if (response.success) {
        updateUserInContext(response.user);
        localStorage.setItem('token', response.token);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await auth.register({ name, email, password, phone });
      
      if (response.success) {
        updateUserInContext(response.user);
        localStorage.setItem('token', response.token);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setSavedPets([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const toggleSavedPet = async (petId) => {
    try {
      const updatedSavedPets = await api.post(`/users/saved-pets/${petId}`);
      setSavedPets(updatedSavedPets.data);

      const updatedUser = { ...user, savedPets: updatedSavedPets.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (error) {
        console.error("Failed to toggle saved pet in context", error);
        throw error;
    }
  };

  const value = {
    user,
    savedPets,
    loading,
    login,
    register,
    logout,
    toggleSavedPet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 