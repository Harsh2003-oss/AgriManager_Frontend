import React, { useState, useEffect } from 'react';
import api from '../../src/config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalCrops: 0,
    totalExpenses: 0,
    activeCrops: 0
  });
  
  const [recentCrops, setRecentCrops] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch farms, crops, and expenses
      const [farmsResponse, cropsResponse, expensesResponse] = await Promise.all([
        api.get('/farms/myfarms'),
        api.get('/crops/mycrops'),
        api.get('/expenses/getexpense')
      ]);

      // Get data from response structure
      const farms = farmsResponse.data.farms || [];
      const crops = cropsResponse.data.crops || [];
      const expenses = expensesResponse.data.expense || [];

      // Calculate stats
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const activeCrops = crops.filter(crop => 
        crop.status === 'growing' || crop.status === 'planted'
      ).length;

      setStats({
        totalFarms: farms.length,
        totalCrops: crops.length,
        totalExpenses,
        activeCrops
      });

      // Set recent data (last 5 items)
      setRecentCrops(crops.slice(0, 5));
      setRecentExpenses(expenses.slice(0, 5));
      
      setLoading(false);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening on your farm.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-green-100 text-sm font-medium mb-2">Total Farms</h3>
          <div className="text-4xl font-bold">{stats.totalFarms}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-blue-100 text-sm font-medium mb-2">Active Crops</h3>
          <div className="text-4xl font-bold">{stats.activeCrops}</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-red-100 text-sm font-medium mb-2">Total Crops</h3>
          <div className="text-4xl font-bold">{stats.totalCrops}</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-yellow-100 text-sm font-medium mb-2">Total Expenses</h3>
          <div className="text-4xl font-bold">₹{stats.totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Crops */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Crops</h2>
          <div className="space-y-4">
            {recentCrops.length > 0 ? (
              recentCrops.map((crop) => (
                <div key={crop._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <div>
                    <div className="text-gray-700 font-medium">{crop.name}</div>
                    <div className="text-gray-500 text-sm">Status: {crop.status}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(crop.plantingDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No crops found</p>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                  <div>
                    <div className="text-gray-700 font-medium">₹{expense.amount}</div>
                    <div className="text-gray-500 text-sm">{expense.category} - {expense.description}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No expenses found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;