import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Signin from './assets/Signin'
import Signup from './assets/Signup'
import Landing from './assets/Landing'
import Dashboard from './assets/Dashboard'
import './App.css'
import './index.css'
import React from 'react'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
       <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App