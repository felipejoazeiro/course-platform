import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar';
import axios from 'axios'
import {CircularProgress, Box, Snackbar, Alert} from '@mui/material';
import DepartmentList from './components/DepartmentList';
import CoursesCards from './components/CoursesCards';
import FilesList from './components/FilesList';


function DashboardPage ({onLogout}) {

    const [isAdmin, setIsAdmin] = useState(false)
   
    const [departments, setDepartments] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [files, setFiles] = useState([])
    const [showFiles, setShowFiles] = useState(false)

    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('')
    const [popup, setPopup] = useState(false)

    useEffect(()=>{
        const getAdmin = async ()=>{
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAdmin`, {headers: {
                    Authorization: `Bearer ${token}`
                }})
                
                setIsAdmin(response.data)

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
            setShowFiles(false)
        }catch(error){
            setMessage(error.message)
            setPopup(true)
            setSeverity('error')
            setLoading(false)
            setShowFiles(false)
        }
    }

    const handleCardClick = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getFiles/${id}`)
            console.log(response.data)
            setFiles(response.data)
            setShowFiles(true)
        } catch (error) {
            console.log(error)
            setShowFiles(true)
        }
    }

    const handlePopup = () =>{
        setPopup(false)
    }

    return(
        <div>
            <Navbar isAdmin={isAdmin} onLogout={onLogout} style={{height: '10vh'}}/>
            <div style={{ display: 'flex', height: '88vh' }}>
                <div style={{ width: '15%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                    <DepartmentList departments={departments} handleChangeDepartment={handleChangeDepartment}/>
                </div>
                
                { loading ? 
                    <Box display="flex" justifyContent="center" alignItems="center" height="80vh" marginTop="15px">
                        <CircularProgress size={60} />
                    </Box> : showFiles ? 
                    (
                            < FilesList files={files}/>
                        ) : (
                            <CoursesCards courses={courses} handleCardClick={handleCardClick} selectedDepartment={selectedDepartment}/>
                    )
                }
            </div>
            <Snackbar open={popup} autoHideDuration = {6000} onClose={handlePopup}>
                <Alert onClose={handlePopup} severity={severity} >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};
export default DashboardPage;