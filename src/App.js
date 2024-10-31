import './App.css';
import React, {useState, useEffect} from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/LoginPage'
import RegisterPage from './pages/Registration/RegisterPage'
import NewPasswordPage from './pages/ResetPassword/NewPasswordPage';
import VerificationCode from './pages/ResetPassword/VerificationCodePage'
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotFoundPage from './NotFoundPage';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute'

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(async ()=>{
    const token = localStorage.getItem('token')
    if(token){
      setIsAuthenticated(true)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAdmin`, {headers: {
          Authorization: `Bearer ${token}`
      }})
      setIsAdmin(response.data)
    }
  }, [localStorage.getItem('token')])

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);  
  }

  const handleLogout = async () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <div>
      <Routes>
          <Route path = "/" element={<Login onLogin={handleLogin}/>}/>
          <Route path = "/register" element={<RegisterPage />}/>
          <Route path = "/newPassword" element={<NewPasswordPage/>} />
          <Route path = "/verificationCode" element={<VerificationCode onLogin={handleLogin}/>}/>
          <Route path = "/dashboard" element = {isAuthenticated ? <DashboardPage onLogout={handleLogout}/> : <Navigate to="/"/>} /> 
          <Route path = "/courses" element = {<ProtectedRoute isAdmin={isAdmin}><DashboardPage /></ProtectedRoute>} />
          <Route path = "/departments" element = {<ProtectedRoute isAdmin={isAdmin}><DashboardPage /></ProtectedRoute>} />
          <Route path = "/management" element = {<ProtectedRoute isAdmin={isAdmin}><DashboardPage /></ProtectedRoute>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
