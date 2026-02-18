import React, { useState } from 'react'
import api from '../../src/config/api'

const Login = () => {
    const[email,setEmail]=useState('')
    const[password,setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!email || !password){
            alert("Please fill all the fields")
            return
        }

        try {
            const response = await api.post('/login', {
                email,
                password
            });
            
            console.log('Response:', response.data);
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            window.location.href = '/dashboard';
                
        } catch (error) {
            console.error(error.response?.data?.error || 'Login failed');
            alert(error.response?.data?.error || 'Something went wrong');
        }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AgriManager</h1>
          <p className="text-gray-600">Welcome back, farmer!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            placeholder='Enter email'
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />

          <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            placeholder='Enter password'
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          
          <button
            type='submit'
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Sign In to Your Farm
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login