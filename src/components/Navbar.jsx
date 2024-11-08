import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material"
import {NavLink} from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


function Navbar({isAdmin, onLogout}) {

    const logout = () => {
        onLogout(localStorage.getItem('token'))
    }

    return (
        <AppBar position = "static" style={{height: "10vh"}}>
            <Toolbar>
                <Typography variant='h6' style={{flexGrow: 1, color:"Black"}} component = {NavLink} to="/dashboard">
                    Logo
                </Typography>
                {isAdmin && (
                    <Box display="flex" justifyContent="cemter" flexGrow={1} mx={2}>
                        <Button variant='contained' component={NavLink} to="/departments" style={({ isActive }) => ({ color: isActive ? 'yellow' : 'white' })}> Departamentos </Button>
                        <Button variant='contained' component={NavLink} to="/courses" style={({ isActive }) => ({ color: isActive ? 'yellow' : 'white' })}> Cursos </Button>
                        <Button variant='contained' component={NavLink} to="/management" style={({ isActive }) => ({ color: isActive ? 'yellow' : 'white' })}> Gestão </Button>
                    </Box>
                )}
                <IconButton color = "inherit" onClick={logout}> <ExitToAppIcon /> </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar