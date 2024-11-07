import React, {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar';
import axios from 'axios'
import {} from '@mui/material';
import DepartmentList from './components/DepartmentList';
import CoursesCards from './components/CoursesCards';
import FilesList from './components/FilesList';


function DashboardPage ({onLogout}) {

    const [isAdmin, setIsAdmin] = useState(false)
   
    const [departments, setDepartments] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [typeFile, setTypeFile] = useState(null)
    const [files, setFiles] = useState([])
    const [showFiles, setShowFiles] = useState(false)

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



    return(
        <div>
            <Navbar isAdmin={isAdmin} onLogout={onLogout} style={{height: '10vh'}}/>
            <div style={{ display: 'flex', height: '88vh' }}>
                <div style={{ width: '15%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                    <DepartmentList departments={departments} handleChangeDepartment={handleChangeDepartment}/>
                </div>
                
                {showFiles ? 
                    (
                        < FilesList files={files}/>
                    ) : (
                        <CoursesCards courses={courses} handleCardClick={handleCardClick} selectedDepartment={selectedDepartment}/>
                    )
                }
            </div>
        </div>
    );
};
export default DashboardPage;