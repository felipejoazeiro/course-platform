import './App.css';
import React, {useState, useEffect} from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/LoginPage'
import RegisterPage from './pages/Registration/RegisterPage'
import NewPasswordPage from './pages/ResetPassword/NewPasswordPage';
import VerificationCode from './pages/ResetPassword/VerificationCodePage'
import DashboardPage from './pages/Dashboard/DashboardPage';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);  
  }

  const handleLogout = (token) => {
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
          <Route path = "/dashboard" element = {isAuthenticated ? <DashboardPage/> : <Navigate to="/"/>} /> 
      </Routes>
    </div>
  );
}

export default App;
