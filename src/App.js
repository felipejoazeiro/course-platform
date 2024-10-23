import './App.css';
import React, {useState} from "react";
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/LoginPage'
import RegisterPage from './pages/Registration/RegisterPage'

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  return (
    <div>
      <Routes>
        <Route path = "/" element={<Login onLogin={handleLogin}/>}/>
        <Route path = "/register" element={<RegisterPage />}/>
        {/* <Route path = "/dashboard" element = {isAuthenticated ? <Dashboard/> : <Navigate to="/"/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
