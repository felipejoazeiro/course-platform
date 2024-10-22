import './App.css';
import React, {useState} from "react";
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/LoginPage'

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  return (
    <div>
      <Routes>
        <Route path = "/" element={<Login onLogin={handleLogin}/>}/>
        {/* <Route path = "/dashboard" element = {isAuthenticated ? <Dashboard/> : <Navigate to="/"/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
