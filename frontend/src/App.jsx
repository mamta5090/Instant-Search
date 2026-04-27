import React from 'react'
import { Route ,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

import { ToastContainer } from 'react-toastify';

import SearchPage from './pages/SearchPage'
import AddProductPage from './pages/AddProductPage'


export const serverUrl = "http://localhost:5000";
const App = () => {
  return (
<>
<ToastContainer />
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
   <Route path="/search" element={<SearchPage />} />
      <Route path="/add" element={<AddProductPage />} />
   </Routes>
   </>
  )
}
export default App
