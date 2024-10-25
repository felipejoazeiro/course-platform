import React, {useState} from "react"
import axios from 'axios';
import { TextField, Button, Paper, Typography, Container, Snackbar, Alert, Link } from '@mui/material';
import './styles.css'
import { useNavigate } from "react-router-dom";

function RegisterPage(){
    const [name, setName] = useState('');
    const [registration, setRegistration] = useState('');
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [popup, setPopup] = useState(false)
    const [severity, setSeverity] = useState('error')

    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const employee = {name, registration, email};

        try{
            console.log(process.env.REACT_APP_API_URL)
            console.log(employee)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`,employee)
            
            console.log(response.status);
            setMessage('Funcionário cadastrado com sucesso')
            setSeverity('success')
            setPopup(true)

            setName('')
            setRegistration('')
            setEmail('')

        }catch(error){
            if(error.response){
                console.log(error.response.data.detail.message)
                setMessage(error.response.data.detail.message || 'Erro desconhecido')
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

    const goToLogin=()=>{
        navigate("/")
    }

    return (
        <div>
            <Container className = "container_register" component="main" maxWidth = "xs">
                <Paper className="card_register" elevation={6}>
                    <Typography variant = "h5" align="center">
                        Registro
                    </Typography>
                    <form className="form_login">
                        <TextField variant="outlined" fullWidth label="Nome" margin ="normal" value={name} onChange={(e)=> setName(e.target.value)}/>
                        <TextField variant="outlined" fullWidth label="Matricula"  margin="normal" value={registration}  onChange={(e)=>setRegistration(e.target.value)}/>
                        <TextField variant="outlined" fullWidth label="E-mail" type="email" margin="normal" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
                        <Button onSubmit={handleSubmit} onClick={handleSubmit} className="button_login" type="submit" variant="contained" color="primary" fullWidth>Registrar</Button>
                    </form>
                    <Typography variant="body2" align="right" style={{marginTop: 10}}>
                        <Link onClick={goToLogin} href="#" style={{ color: 'blue' }}>
                            Voltar para login
                        </Link>
                    </Typography>
                </Paper>
                <Snackbar open={popup} autoHideDuration={6000} onClose = {handlePopup}>
                    <Alert onClose={handlePopup} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    )
}

export default RegisterPage