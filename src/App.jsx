import { useState } from 'react'
import React from 'react';

import './App.css'
import './index.css'

import Landing from './assets/Landing';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Landing />
    </>
  )
}

export default App
