import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material"
import {NavLink} from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


function Navbar({isAdmin, onLogout}) {

    const logout = () => {
        console.log(localStorage.getItem('token'))
        onLogout(localStorage.getItem('token'))
    }

    return (
        <AppBar position = "static" >
            <Toolbar style={{height: "10vh", display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
                <Typography variant='h6' style={{color:"Black"}} component = {NavLink} to="/dashboard">
                    Logo
                </Typography>
                {isAdmin && (
                    <Box width="30vh" style={{display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
                        <Button variant='contained' component={NavLink} to="/courses" style={({ isActive }) => ({ color: isActive ? 'green' : 'white' })}> Cursos </Button>
                        <Button variant='contained' component={NavLink} to="/management" style={({ isActive }) => ({ color: isActive ? 'green' : 'white' })} > Gestão </Button>
                    </Box>
                )}
                <IconButton color = "inherit" onClick={logout}> <ExitToAppIcon /> </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar