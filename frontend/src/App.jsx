import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import Dashboard from '../components/Dashboard/Dashboard'
import Farms from '../components/Farms/Farm'
import Expenses from '../components/Expenses/Expenses'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
     <Route path='/' element= {< Login/>} />
     <Route path='/' element= {< Login/>} /> 
     <Route path='/register' element ={< Register />} />
     <Route path='/dashboard' element={<Dashboard />} />
     <Route path='/farm' element={<Farms />} />
     <Route path='/expense' element={<Expenses />} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
