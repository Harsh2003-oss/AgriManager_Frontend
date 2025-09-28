// components/Weather/Weather.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('http://localhost:3000/farms/myfarms', { headers });
      setFarms(response.data.farms || []);
    } catch (error) {
      console.error('Error fetching farms:', error);
      setError('Failed to load farms');
    }
  };

  const fetchWeather = async (farmId) => {
    if (!farmId) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`http://localhost:3000/weather/farm/${farmId}`, { headers });
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError(error.response?.data?.error || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmChange = (e) => {
    const farmId = e.target.value;
    setSelectedFarm(farmId);
    if (farmId) {
      fetchWeather(farmId);
    } else {
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const getUVIndexColor = (uv) => {
    if (uv <= 2) return 'bg-green-100 text-green-800';
    if (uv <= 5) return 'bg-yellow-100 text-yellow-800';
    if (uv <= 7) return 'bg-orange-100 text-orange-800';
    if (uv <= 10) return 'bg-red-100 text-red-800';
    return 'bg-purple-100 text-purple-800';
  };

  const getUVIndexLevel = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
         style={{backgroundImage: "url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"}}>
      
      {/* Overlay for opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-85"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather Information</h1>
          <p className="text-gray-600">Get real-time weather data for your farms</p>
        </div>

        {/* Farm Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Farm for Weather Data:
          </label>
          <select
            value={selectedFarm}
            onChange={handleFarmChange}
            className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Choose a farm...</option>
            {farms.map(farm => (
              <option key={farm._id} value={farm._id}>
                {farm.name} - {farm.location?.address || 'No address'}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌤️</div>
            <p className="text-lg text-gray-600">Fetching weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Weather Data Display */}
        {weatherData && !loading && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{weatherData.farm.name}</h2>
                  <p className="text-gray-600">{weatherData.weather.location.name}, {weatherData.weather.location.region}</p>
                </div>
                <div className="text-right">
                  <div className="text-6xl mb-2">{getWeatherIcon(weatherData.weather.current.condition)}</div>
                  <p className="text-lg font-medium text-gray-700">{weatherData.weather.current.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{weatherData.weather.current.temperature}°C</p>
                  <p className="text-sm text-gray-600">Temperature</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{weatherData.weather.current.feelsLike}°C</p>
                  <p className="text-sm text-gray-600">Feels Like</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{weatherData.weather.current.humidity}%</p>
                  <p className="text-sm text-gray-600">Humidity</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{weatherData.weather.current.windSpeed}</p>
                  <p className="text-sm text-gray-600">Wind (km/h)</p>
                </div>
              </div>
            </div>

            {/* Detailed Weather Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Atmospheric Conditions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Atmospheric Conditions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pressure:</span>
                    <span className="font-medium">{weatherData.weather.current.pressure} mb</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibility:</span>
                    <span className="font-medium">{weatherData.weather.current.visibility} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cloud Cover:</span>
                    <span className="font-medium">{weatherData.weather.current.cloudCover}%</span>
                  </div>
                </div>
              </div>

              {/* UV Index */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">UV Index</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    {weatherData.weather.current.uvIndex}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getUVIndexColor(weatherData.weather.current.uvIndex)}`}>
                    {getUVIndexLevel(weatherData.weather.current.uvIndex)}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">UV Protection {weatherData.weather.current.uvIndex > 5 ? 'Recommended' : 'Not Required'}</p>
                </div>
              </div>

              {/* Farming Insights */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Farming Insights</h3>
                <div className="space-y-3">
                  {weatherData.weather.current.temperature > 30 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-red-500">⚠️</span>
                      <p className="text-sm">High temperature - consider extra watering</p>
                    </div>
                  )}
                  {weatherData.weather.current.humidity < 40 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-500">💧</span>
                      <p className="text-sm">Low humidity - monitor soil moisture</p>
                    </div>
                  )}
                  {weatherData.weather.current.windSpeed > 25 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500">💨</span>
                      <p className="text-sm">Strong winds - secure loose materials</p>
                    </div>
                  )}
                  {weatherData.weather.current.uvIndex > 7 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-500">☀️</span>
                      <p className="text-sm">High UV - protect workers and sensitive crops</p>
                    </div>
                  )}
                  {weatherData.weather.current.condition.toLowerCase().includes('rain') && (
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">🌧️</span>
                      <p className="text-sm">Rain expected - adjust irrigation schedule</p>
                    </div>
                  )}
                  {!weatherData.weather.current.temperature || 
                   (weatherData.weather.current.temperature <= 30 && 
                    weatherData.weather.current.humidity >= 40 && 
                    weatherData.weather.current.windSpeed <= 25 && 
                    weatherData.weather.current.uvIndex <= 7 && 
                    !weatherData.weather.current.condition.toLowerCase().includes('rain')) && (
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✅</span>
                      <p className="text-sm">Good conditions for farming activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Country:</p>
                  <p className="font-medium">{weatherData.weather.location.country}</p>
                </div>
                <div>
                  <p className="text-gray-600">Region:</p>
                  <p className="font-medium">{weatherData.weather.location.region}</p>
                </div>
                <div>
                  <p className="text-gray-600">Latitude:</p>
                  <p className="font-medium">{weatherData.weather.location.lat}°</p>
                </div>
                <div>
                  <p className="text-gray-600">Longitude:</p>
                  <p className="font-medium">{weatherData.weather.location.lon}°</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Farm Selected State */}
        {!selectedFarm && !loading && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-6">🌤️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Farm to View Weather</h3>
            <p className="text-gray-600">Choose one of your farms from the dropdown above to see current weather conditions and farming insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;