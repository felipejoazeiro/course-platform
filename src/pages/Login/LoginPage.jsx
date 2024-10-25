import React, {useState} from "react";
import { TextField, Button, Paper, Typography, Container, Link, Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './styles.css'


function Login({onLogin}){
    const navigate  = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupState, setPopupState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const goToRegister = () => {
        navigate('/register')
    }

    const handlePopup = ()=>{
        setPopupState(false)
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
                <Typography variant="body2" align="right" style={{marginTop: 10}}>
                        <Link onClick={goToRegister} href="#" style={{ color: 'blue' }}>
                            Registrar
                        </Link>
                    </Typography>
            </Paper>
            <Snackbar open ={popupState} autoHideDuration={6000} onClose={handlePopup}>
                <Alert onClose={handlePopup} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Login;