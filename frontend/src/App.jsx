import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import Dashboard from '../components/Dashboard/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
     <Route path='/' element= {< Login/>} />
     <Route path='/' element= {< Login/>} /> 
     <Route path='/register' element ={< Register />} />
     <Route path='/dashboard' element={<Dashboard />} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
