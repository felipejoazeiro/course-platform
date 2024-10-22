import React, {useState} from "react";
import { TextField, Button, Paper, Typography, Container } from '@mui/material';
import './styles.css'


function Login({onLogin}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
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
            </Paper>
        </Container>
    );
}

export default Login;