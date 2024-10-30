import React, {useState} from 'react'
import axios from 'axios'
import {Container, Button, Paper, TextField, Typography, Alert, CircularProgress, Snackbar} from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from "react-router-dom";

function VerificationCodePage({onLogin}){
    const [register, setRegister] = useState('')
    const [code, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [popup, setPopup] = useState(false)
    const [severity, setSeverity] = useState('')
    const [loading, setLoading] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [recaptchaValue, setRecaptchaValue] = useState(null)
    const navigate  = useNavigate();

    const sendVerificationEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setButtonDisabled(true);
        const sendRegister = {registration: register};
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendVerificationCode`, sendRegister)
            setTimeout(() => {
                setButtonDisabled(false); 
              }, 60000);
            if(response.status === 200){
                setMessage(response.data.message)
                setSeverity('success')
                setPopup(true)
            }else{
                setMessage(response.data.detail.message)
                setSeverity('error')
                setPopup(true)
            }
        } catch (error) {
            if(error.response){
                setMessage(error.response.data.detail.message)
            }else{
                setMessage('Erro ao enviar e-mail')
            }
            setSeverity('error')
            setPopup(true)
            setButtonDisabled(false);
        } finally{
            setLoading(false)
        }
    }

    const verifyCode = async ()=> {
        if(!recaptchaValue){
            setMessage('Por favor, realize a verificação')
            setSeverity('info')
            setPopup(true)
            return;
        }

        setLoading(true)
        try{
            const data = {registration: register, code: code, recaptcha: recaptchaValue}
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/verifyCode`, data)
            if(response.status === 200){
                onLogin(response.data.access_token)
                navigate("/newPassword")
            }else{
                setMessage(response.data.message)
                setSeverity('error')
                setPopup(true)
            }
        }catch (error){
            setMessage('Erro ao validar o código')
            setSeverity('error')
            setPopup(true)
        }finally{
            setLoading(false)
            setRecaptchaValue(null)
        }
    }

    const handlePopup = ()=>{
        setPopup(false)
    }

    return (
        <div className="container_verification_code">
            <Container component="main" maxWidth="xs">
                <Paper className='card_verification_code' elevation={6}>
                    <Typography variant='h5' align='center' gutterBottom>
                        Verificação
                    </Typography>
                    <TextField
                        type="text"
                        variant='outlined'
                        fullWidth
                        label="Matrícula"
                        margin='normal'
                        value={register}
                        onChange={(e) => setRegister(e.target.value)}
                        className="text-field"
                    />
                    <TextField
                        type="text"
                        variant='outlined'
                        fullWidth
                        label="Código"
                        margin='normal'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="text-field"
                    />
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCH_KEY}
                        onChange={(value) => setRecaptchaValue(value)}
                        className="recaptcha"
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: '20px' }}>
                        <Button
                            onClick={sendVerificationEmail}
                            variant='contained'
                            color='primary'
                            disabled={loading || buttonDisabled}
                            className="action-button"
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Código de Verificação'}
                        </Button>
                        <Button
                            onClick={verifyCode}
                            variant='contained'
                            color='secondary'
                            disabled={loading || !recaptchaValue}
                            className="action-button"
                        >
                            Confirmar Código
                        </Button>
                    </div>
                </Paper>
                <Snackbar open={popup} autoHideDuration={6000} onClose={handlePopup}>
                    <Alert onClose={handlePopup} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    )
}

export default VerificationCodePage