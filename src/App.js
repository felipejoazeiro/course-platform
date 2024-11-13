import './App.css';
import React, {useState, useEffect} from "react";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login/LoginPage'
import RegisterPage from './pages/Registration/RegisterPage'
import NewPasswordPage from './pages/ResetPassword/NewPasswordPage';
import VerificationCode from './pages/ResetPassword/VerificationCodePage'
import DashboardPage from './pages/Dashboard/DashboardPage';
import CoursePage from './pages/Courses/CoursesPage';
import NotFoundPage from './NotFoundPage';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute'
import ManagerPage from './pages/Manager/ManagerPage';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  const checkAuthentication = async () => {
      const token = localStorage.getItem('token')
      if(token){
        try {
          const checkTokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/checkToken`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (checkTokenResponse.data === true) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAdmin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data)
            setIsAdmin(response.data);
        }
        } catch (error) {
          console.error('Erro ao verificar o token:', error);
                    localStorage.removeItem('token'); // Remover o token em caso de erro
                    setIsAuthenticated(false);
        }
    }else{
      setIsAuthenticated(false);
    }
  };

  useEffect(()=>{
    checkAuthentication(); 
  }, []);

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    checkAuthentication(); 
    setIsAuthenticated(true);  
  }

  const handleLogout = async () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate("/")
  }

  return (
    <div>
      <Routes>
          <Route path = "/" element={<Login onLogin={handleLogin}/>}/>
          <Route path = "/register" element={<RegisterPage />}/>
          <Route path = "/newPassword" element={<NewPasswordPage/>} />
          <Route path = "/verificationCode" element={<VerificationCode onLogin={handleLogin}/>}/>
          <Route path = "/dashboard" element = {isAuthenticated ? <DashboardPage onLogout={handleLogout}/> : <Navigate to="/"/>} /> 
          <Route path = "/courses" element = {<ProtectedRoute isAdmin={isAdmin}><CoursePage onLogout={handleLogout}/></ProtectedRoute>} />
          <Route path = "/management" element = {<ProtectedRoute isAdmin={isAdmin}><ManagerPage onLogout={handleLogout}/></ProtectedRoute>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
