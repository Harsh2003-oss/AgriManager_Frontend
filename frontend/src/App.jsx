import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Dashboard from '../components/Dashboard/Dashboard';
import Farms from '../components/Farms/Farm';
import Crops from '../components/Crops/Crop';
import Expenses from '../components/Expenses/Expenses';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated() && <Navbar />}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard refreshTrigger={refreshTrigger} />
            </ProtectedRoute>
          } />
          
          <Route path="/farms" element={
            <ProtectedRoute>
              <Farms onDataChange={handleDataChange} />
            </ProtectedRoute>
          } />
          
          <Route path="/crops" element={
            <ProtectedRoute>
              <Crops onDataChange={handleDataChange} />
            </ProtectedRoute>
          } />
          
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses onDataChange={handleDataChange} />
            </ProtectedRoute>
          } />

          {/* Default Routes */}
          <Route path="/" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } />
          
          {/* Catch all route */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;