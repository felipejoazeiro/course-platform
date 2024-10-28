import React, {useState} from 'react'
import axios from 'axios'
import { Container,Button, Paper, Snackbar, TextField, Typography, Alert } from '@mui/material'
import './styles.css'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../UserContext';


function NewPasswordPage(){

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setNewMessage] = useState('');
    const [popup, setPopup] = useState(false);
    const {userId} = useUser();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userId)
        const passwordJson = {id: parseInt(userId,10), password: newPassword}
        console.log(passwordJson);
        if(newPassword !== confirmNewPassword){
            setNewMessage('As senhas não são iguais.')
            setPopup(true);
            return;
        }else{
            try{
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/newPassword`, passwordJson)
                if(response.status === 200){
                    goToHome();
                }else{
                    setNewMessage(response.data.message)
                    setPopup(true)
                }
            }catch(error){
                setNewMessage('Erro ao alterar a senha.')
                setPopup(true);
            }
        }
    }

    const handlePopup = ()=> {
        setPopup(false)
    }

    const goToHome = ()=>{
        navigate("/home")
    }

    return (
        <div>
            <Container className = "container_new_password" component="main" maxWidth="xs">
                <Paper className='card_new_password' elevation={6}>
                    <Typography variant='h5' align='center'>
                        Nova Senha
                    </Typography>
                    <form className='form_new_password' onSubmit={handleSubmit} method="post">
                        <TextField type='password' required variant='outlined' fullWidth label="Nova senha" margin='normal' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
                        <TextField type='password' required variant='outlined' fullWidth label="Confirme a senha" margin='normal' value={confirmNewPassword} onChange={(e)=> setConfirmNewPassword(e.target.value)}/>    
                        <Button className="button_change_password" type="submit" variant="contained" color="primary" fullWidth>Alterar</Button>
                    </form>
                </Paper>    
                <Snackbar open={popup} autoHideDuration={6000} onClose={handlePopup}>
                    <Alert onClose={handlePopup} severity='error'>
                        {message}
                    </Alert>
                </Snackbar>            
            </Container>
        </div>
    )
}


export default NewPasswordPage