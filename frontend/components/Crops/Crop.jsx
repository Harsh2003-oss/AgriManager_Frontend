
// components/Crops/Crops.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Crops = ({ onDataChange }) => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 'planted',
    farm: '',
    plantingDate: '',
    expectedHarvestDate: '',
    actualHarvestDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch crops and farms
      const [cropsResponse, farmsResponse] = await Promise.all([
        axios.get('http://localhost:3000/crops/mycrops', { headers }),
        axios.get('http://localhost:3000/farms/myfarms', { headers })
      ]);

      setCrops(cropsResponse.data.crops || []);
      setFarms(farmsResponse.data.farms || []);
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

      if (editingCrop) {
        // Update crop
        await axios.put(`http://localhost:3000/crops/${editingCrop._id}`, formData, { headers });
      } else {
        // Create new crop
        await axios.post('http://localhost:3000/crops/create', formData, { headers });
      }

      // Refresh data and notify dashboard
      await fetchData();
      onDataChange && onDataChange();
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error saving crop:', error);
      alert(error.response?.data?.error || 'Error saving crop');
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      status: crop.status,
      farm: crop.farm,
      plantingDate: crop.plantingDate ? crop.plantingDate.split('T')[0] : '',
      expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.split('T')[0] : '',
      actualHarvestDate: crop.actualHarvestDate ? crop.actualHarvestDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        await axios.delete(`http://localhost:3000/crops/${cropId}`, { headers });
        
        // Refresh data and notify dashboard
        await fetchData();
        onDataChange && onDataChange();
        
      } catch (error) {
        console.error('Error deleting crop:', error);
        alert('Error deleting crop');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'planted',
      farm: '',
      plantingDate: '',
      expectedHarvestDate: '',
      actualHarvestDate: ''
    });
    setEditingCrop(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planted': return 'bg-blue-100 text-blue-800';
      case 'growing': return 'bg-green-100 text-green-800';
      case 'harvested': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f._id === farmId);
    return farm ? farm.name : 'Unknown Farm';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600">Loading crops...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
         style={{backgroundImage: "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"}}>
      
      {/* White overlay for opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Crops Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add New Crop
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm *
                  </label>
                  <select
                    name="farm"
                    value={formData.farm}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
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
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="harvested">Harvested</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planting Date *
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Harvest Date
                  </label>
                  <input
                    type="date"
                    name="expectedHarvestDate"
                    value={formData.expectedHarvestDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  />
                </div>

                {formData.status === 'harvested' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Harvest Date
                    </label>
                    <input
                      type="date"
                      name="actualHarvestDate"
                      value={formData.actualHarvestDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                )}

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
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    {editingCrop ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.length > 0 ? (
            crops.map(crop => (
              <div key={crop._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{crop.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                    {crop.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Farm:</strong> {getFarmName(crop.farm)}</p>
                  <p><strong>Planted:</strong> {new Date(crop.plantingDate).toLocaleDateString()}</p>
                  {crop.expectedHarvestDate && (
                    <p><strong>Expected Harvest:</strong> {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
                  )}
                  {crop.actualHarvestDate && (
                    <p><strong>Actual Harvest:</strong> {new Date(crop.actualHarvestDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crop._id)}
                    className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl text-gray-300 mb-4">🌾</div>
              <p className="text-gray-500 text-lg mb-4">No crops found</p>
              <p className="text-gray-400 text-sm mb-6">Add your first crop to start tracking growth</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Add Your First Crop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crops;
