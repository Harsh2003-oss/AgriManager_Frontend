import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import { fromJSON } from 'postcss'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
     <Route path='/' element= {< Login/>} />
     <Route path='/' element= {< Login/>} /> 
     <Route path='/register' element ={< Register />} />
     </Routes>
    </BrowserRouter>
  )
}

export default App
