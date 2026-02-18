import React, { useState, useEffect } from 'react';
import api from '../../src/config/api'

const Farms = ({ onDataChange }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      address: '',
      coordinates: []
    },
    totalArea: '',
    fields: ''
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await api.get('/farms/myfarms');
      setFarms(response.data.farms || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching farms:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        name: formData.name,
        location: {
          address: formData.location.address,
          coordinates: formData.location.coordinates || []
        },
        totalArea: parseFloat(formData.totalArea),
        fields: formData.fields
      };

      if (editingFarm) {
        await api.put(`/farms/${editingFarm._id}`, submitData);
      } else {
        await api.post('/farms/create', submitData);
      }

      await fetchFarms();
      onDataChange && onDataChange();
      resetForm();
      
    } catch (error) {
      console.error('Error saving farm:', error);
      alert(error.response?.data?.error || 'Error saving farm');
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: {
        address: farm.location?.address || '',
        coordinates: farm.location?.coordinates || []
      },
      totalArea: farm.totalArea.toString(),
      fields: farm.fields || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm? This will also delete all associated crops.')) {
      try {
        await api.delete(`/farms/${farmId}`);
        await fetchFarms();
        onDataChange && onDataChange();
      } catch (error) {
        console.error('Error deleting farm:', error);
        alert('Error deleting farm');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: {
        address: '',
        coordinates: []
      },
      totalArea: '',
      fields: ''
    });
    setEditingFarm(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-600">Loading farms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Farms Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Add New Farm
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingFarm ? 'Edit Farm' : 'Add New Farm'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Name *
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
                  Location Address *
                </label>
                <textarea
                  name="address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  rows="3"
                  placeholder="Enter full address of the farm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Area (in acres) *
                </label>
                <input
                  type="number"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Description
                </label>
                <textarea
                  name="fields"
                  value={formData.fields}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  rows="3"
                  placeholder="Describe the fields, soil type, irrigation setup, etc."
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
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingFarm ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length > 0 ? (
          farms.map(farm => (
            <div key={farm._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{farm.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {farm.totalArea} acres
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Location:</p>
                  <p className="text-sm text-gray-800">{farm.location?.address || 'No address provided'}</p>
                </div>

                {farm.fields && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fields:</p>
                    <p className="text-sm text-gray-800">{farm.fields}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Created: {new Date(farm.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(farm)}
                  className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(farm._id)}
                  className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🏡</div>
            <p className="text-gray-500 text-lg mb-4">No farms found</p>
            <p className="text-gray-400 text-sm mb-6">Create your first farm to start managing crops and expenses</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Add Your First Farm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Farms;