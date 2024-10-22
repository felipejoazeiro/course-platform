import React, {useState} from "react";
import { TextField, Button, Paper, Typography, Container } from '@mui/material';


function Login({onLogin}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    }

    return (
        <Container component="main" maxWidth = "xs" style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent:'center', height:'100vh' }}>
            <Paper elevation={6} style={{padding: '20px'}}>
                <Typography variant = "h5" align="center">
                    Login
                </Typography>
                <form style={{marginTop: '20px'}}>
                    <TextField variant="outlined" fullWidth label="Login" margin ="normal" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                    <TextField variant="outlined" fullWidth label="Senha" type="password" margin="normal"/>
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>Entrar</Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;