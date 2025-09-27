import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = ({ onDataChange }) => {
  const [expenses, setExpenses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'seeds',
    farm: '',
    crop: '',
    date: ''
  });

  const categories = ["seeds", "fertilizers", "pesticides", "labor", "machinery", "irrigation", "transportation", "others"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch expenses, farms, and crops
      const [expensesResponse, farmsResponse, cropsResponse] = await Promise.all([
        axios.get('http://localhost:3000/expenses/getexpense', { headers }),
        axios.get('http://localhost:3000/farms/myfarms', { headers }),
        axios.get('http://localhost:3000/crops/mycrops', { headers })
      ]);

      setExpenses(expensesResponse.data.expense || []);
      setFarms(farmsResponse.data.farms || []);
      setCrops(cropsResponse.data.crops || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Prepare data for backend
      const submitData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        farm: formData.farm,
        date: formData.date
      };

      // Add crop if selected
      if (formData.crop) {
        submitData.crop = formData.crop;
      }

      if (editingExpense) {
        // Update expense
        await axios.put(`http://localhost:3000/expenses/${editingExpense._id}`, submitData, { headers });
      } else {
        // Create new expense
        await axios.post('http://localhost:3000/expenses/create', submitData, { headers });
      }

      // Refresh data and notify dashboard
      await fetchData();
      onDataChange && onDataChange();
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error saving expense:', error);
      alert(error.response?.data?.error || 'Error saving expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      farm: expense.farm,
      crop: expense.crop || '',
      date: expense.date ? expense.date.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        await axios.delete(`http://localhost:3000/expenses/${expenseId}`, { headers });
        
        // Refresh data and notify dashboard
        await fetchData();
        onDataChange && onDataChange();
        
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      category: 'seeds',
      farm: '',
      crop: '',
      date: ''
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      seeds: 'bg-green-100 text-green-800',
      fertilizers: 'bg-blue-100 text-blue-800',
      pesticides: 'bg-red-100 text-red-800',
      labor: 'bg-yellow-100 text-yellow-800',
      machinery: 'bg-purple-100 text-purple-800',
      irrigation: 'bg-cyan-100 text-cyan-800',
      transportation: 'bg-orange-100 text-orange-800',
      others: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.others;
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f._id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  const getCropName = (cropId) => {
    if (!cropId) return 'General Expense';
    const crop = crops.find(c => c._id === cropId);
    return crop ? crop.name : 'Unknown Crop';
  };

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
         style={{backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"}}>
      
      {/* White overlay for opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expenses Management</h1>
            <p className="text-gray-600 mt-1">Total: ₹{totalExpenses.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add New Expense
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    rows="3"
                    placeholder="Describe the expense"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm *
                  </label>
                  <select
                    name="farm"
                    value={formData.farm}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Farm</option>
                    {farms.map(farm => (
                      <option key={farm._id} value={farm._id}>
                        {farm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop (Optional)
                  </label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">General Farm Expense</option>
                    {crops.map(crop => (
                      <option key={crop._id} value={crop._id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {editingExpense ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map(expense => (
              <div key={expense._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">₹{expense.amount.toLocaleString()}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="text-gray-800 font-medium">{expense.description}</p>
                  <p><strong>Farm:</strong> {getFarmName(expense.farm)}</p>
                  <p><strong>Crop:</strong> {getCropName(expense.crop)}</p>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl text-gray-300 mb-4">💰</div>
              <p className="text-gray-500 text-lg mb-4">
                {filterCategory === 'all' ? 'No expenses found' : `No ${filterCategory} expenses found`}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;