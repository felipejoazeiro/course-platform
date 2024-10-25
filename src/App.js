import './App.css';
import React, {useState} from "react";
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/LoginPage'
import RegisterPage from './pages/Registration/RegisterPage'
import NewPasswordPage from './pages/ResetPassword/NewPasswordPage';
import { UserProvider } from './UserContext';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  return (
    <div>
      <UserProvider>
        <Routes>
            <Route path = "/" element={<Login onLogin={handleLogin}/>}/>
            <Route path = "/register" element={<RegisterPage />}/>
            <Route path = "/newPassword" element={<NewPasswordPage/>} />
            {/* <Route path = "/dashboard" element = {isAuthenticated ? <Dashboard/> : <Navigate to="/"/>} /> */}
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
