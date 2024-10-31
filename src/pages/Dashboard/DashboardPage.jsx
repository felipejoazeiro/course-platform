import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar';
import axios from 'axios'
import { ListItem, ListItemText, List, Typography, CardContent, Card, Chip} from '@mui/material';


function DashboardPage ({onLogout}) {

    const [isAdmin, setIsAdmin] = useState(false)
   
    const [departments, setDepartments] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)

    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [popUp, setPopup] = useState(false)

    useEffect(()=>{
        const getAdmin = async ()=>{
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAdmin`, {headers: {
                    Authorization: `Bearer ${token}`
                }})
                setIsAdmin(response.data)
                console.log(response.data)

            } catch (error) {
                setMessage(error.message)
                setPopup(true)
                setSeverity('error')
            }
        }

        getAdmin()
    }, [])

    useEffect(()=>{
        const fetchDepartments = async ()=>{
            try{
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/departments`)
                const data = response.data
                setDepartments(data)
            }catch(error){
                setMessage(error.message)
                setPopup(true)
                setSeverity('error')
            }
        }
        fetchDepartments();

    }, [])

    useEffect(()=>{
        console.log(departments)
    }, [departments])

    useEffect(()=>{
        console.log(courses)
    }, [courses])

    const handleChangeDepartment = async (id, name) => {
        setLoading(true)
        try{
            setSelectedDepartment(name)
            const token = localStorage.getItem('token')
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses`,{ headers:{
                Authorization: `Bearer ${token}`
            },  params: {"department_id": id}, })
            const data = response.data.courses
            setCourses(data)
            setLoading(false)
        }catch(error){
            setMessage(error.message)
            setPopup(true)
            setSeverity('error')
            setLoading(false)
        }
    }
 
    return(
        <div>
            <Navbar isAdmin={isAdmin} onLogout={onLogout}  />
                <div style={{ display: 'flex', height: '100vh' }}>
                    <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                        <List>
                            {departments.map((department) => (
                                <ListItem
                                    button
                                    key={department.id}
                                    onClick={() => handleChangeDepartment(department.id, department.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ListItemText primary={department.name} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div style={{ width: '70%', padding: '10px', overflowY: 'auto' }}>
                        <Typography variant='h5' gutterBottom>
                            {selectedDepartment === null ? '' : `Cursos de ${selectedDepartment}`}
                        </Typography>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <Card 
                                    key={index} 
                                    style={{ 
                                        width: 'calc(33.33% - 16px)', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        height: '100%', 
                                        borderRadius: '8px', 
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.05)', 
                                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', 
                                        }
                                    }}
                                >
                                    <CardContent style={{ 
                                        flexGrow: 1, 
                                        padding: '16px', 
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            style={{ 
                                                marginBottom: '8px', 
                                                whiteSpace: 'nowrap', 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis', 
                                                fontSize: '1rem',
                                                color: '#333' 
                                            }}
                                        >
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color='text.secondary'>
                                            {course.description}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ 
                                        padding: '16px', 
                                        display: 'flex', 
                                        justifyContent: 'flex-end' // Alinha o status à direita
                                    }}>
                                        <Chip 
                                            label={course.completed ? "Completo" : "Incompleto"} 
                                            color={course.completed ? "success" : "error"} 
                                            style={{ fontWeight: 'bold' }} 
                                        />
                                    </CardContent>
                                </Card>

                        ))
                    ) : (
                            <Typography variant="body2">Nenhum curso disponível.</Typography>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;