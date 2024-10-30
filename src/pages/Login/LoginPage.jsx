import React, {useState} from "react";
import axios from 'axios';
import { TextField, Button, Paper, Typography, Container, Link, Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";

import './styles.css'


function Login(){
    const navigate  = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupState, setPopupState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const login = {username, password}

        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, login)
            console.log(response)

            if(response.status === 202){
                localStorage.setItem("token", response.data.access_token);
                navigate("/newPassword")
            }else{
                localStorage.setItem("token", response.data.access_token);
                navigate("/dashboard")
            }
        }catch(error){
            if(error.response){
                setErrorMessage(error.response.data.detail)
            }else{
                setErrorMessage('Erro de rede')
            }
            setPopupState(true)
        }
    }

    const goToRegister = () => {
        navigate('/register')
    }

    const goToVerifyCode = () => {
        navigate("/verificationCode")
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
                <form className="form_login" onSubmit={handleSubmit}>
                    <TextField required variant="outlined" fullWidth label="Login" margin ="normal" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                    <TextField required variant="outlined" fullWidth label="Senha" type="password" margin="normal" value={password}  onChange={(e)=>setPassword(e.target.value)}/>
                    <Button className="button_login" type="submit" variant="contained" color="primary" fullWidth>Entrar</Button>
                </form>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="body2" align="right" style={{marginTop: 10}}>
                        <Link onClick={goToVerifyCode} href="#" style={{ color: 'blue' }}>
                            Esqueci a senha
                        </Link>
                    </Typography>
                    <Typography variant="body2" align="right" style={{marginTop: 10}}>
                        <Link onClick={goToRegister} href="#" style={{ color: 'blue' }}>
                            Cadastro
                        </Link>
                    </Typography>
                </div>
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