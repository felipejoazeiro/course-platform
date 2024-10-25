import React, {useState} from "react";
import axios from 'axios';
import { TextField, Button, Paper, Typography, Container, Link, Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useUser } from '../../UserContext';
import './styles.css'


function Login({onLogin}){
    const navigate  = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupState, setPopupState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {setUserId} = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const login = {username, password}

        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, login)
            console.log(response)

            if(response.status === 202){
                console.log('Nova Senha')
            }else{
                setUserId(response.data.user_id)
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