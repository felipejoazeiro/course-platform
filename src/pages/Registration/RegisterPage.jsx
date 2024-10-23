import React, {useState} from "react"
import axios from 'axios';
import { TextField, Button, Paper, Typography, Container, Snackbar, Alert } from '@mui/material';
import './styles.css'

function RegisterPage(){
    const [name, setName] = useState('');
    const [register, setRegister] = useState('');
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [popup, setPopup] = useState(false)
    const [severity, setSeverity] = useState('error')

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const employee = {name, register, email};

        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`,employee)
            setMessage('Funcionário cadastrado com sucesso')
            setSeverity('success')
            setPopup(true)

            setName('')
            setRegister('')
            setEmail('')

        }catch(error){
            if(error.response){
                setMessage(error.response.data.message || 'Erro desconhecido')
            }else{
                setMessage('Erro de rede')
            }
            setSeverity('error')
            setPopup(true)
        }
    }

    const handlePopup = ()=> {
        setPopup(false)
    }

    return (
        <Container className = "container_register" component="main" maxWidth = "xs">
            <Paper className="card_register" elevation={6}>
                <Typography variant = "h5" align="center">
                    Register
                </Typography>
                <form className="form_login">
                    <TextField variant="outlined" fullWidth label="Nome" margin ="normal" value={name} onChange={(e)=> setName(e.target.value)}/>
                    <TextField variant="outlined" fullWidth label="Matricula"  margin="normal" value={register}  onChange={(e)=>setRegister(e.target.value)}/>
                    <TextField variant="outlined" fullWidth label="E-mail" type="email" margin="normal" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
                    <Button onSubmit={handleSubmit} className="button_login" type="submit" variant="contained" color="primary" fullWidth>Entrar</Button>
                </form>
            </Paper>
            <Snackbar open={popup} autoHideDuration={6000} onClose = {handlePopup}>
                <Alert onClose={handlePopup} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default RegisterPage