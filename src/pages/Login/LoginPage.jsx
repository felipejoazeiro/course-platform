import React, {useState} from "react";
import { TextField, Button, Paper, Typography, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './styles.css'


function Login({onLogin}){
    const navigate  = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const goToRegister = () => {
        navigate('/register')
    }

    return (
        <Container className="container_login"component="main" maxWidth = "xs">
            <Paper className="card_login" elevation={6}>
                <Typography variant = "h5" align="center">
                    Login
                </Typography>
                <form className="form_login">
                    <TextField variant="outlined" fullWidth label="Login" margin ="normal" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                    <TextField variant="outlined" fullWidth label="Senha" type="password" margin="normal" value={password}  onChange={(e)=>setPassword(e.target.value)}/>
                    <Button onSubmit={handleSubmit} className="button_login" type="submit" variant="contained" color="primary" fullWidth>Entrar</Button>
                </form>
                <Button onClick={goToRegister} className="button_login" variant="contained" color="warning" fullWidth>Registrar</Button>
            </Paper>
        </Container>
    );
}

export default Login;