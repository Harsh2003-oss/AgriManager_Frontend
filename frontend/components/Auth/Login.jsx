
import React, { useState } from 'react'


const Login = () => {

    const[email,setEmail]=useState('')
    const[password,setPassword] = useState('')

    const handleSubmit = (e) => {
e.preventDefault();

if(!email || !password){
    alert("Please fill all the fields")
    return
}
console.log('Login attempt:', { email, password })

    }

  return (
    <>
      <form onSubmit={handleSubmit}>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
type="email" placeholder='Enter email' />

<input
value={password}
onChange={(e)=>setPassword(e.target.value)}
type="password" placeholder='Enter password' />
    <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Login
