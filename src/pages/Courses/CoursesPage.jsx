import React, {useState, useEffect} from 'react'

import {List, ListItem, ListItemText, Button, Typography, Dialog, DialogTitle, DialogActions, IconButton, Box} from '@mui/material'
import Navbar from '../../components/Navbar'
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Slideshow from '@mui/icons-material/Slideshow'; 
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import axios from 'axios'

function CoursePage(onLogout){
    const [isAdmin, setIsAdmin] = useState(false)
    const [departments, setDepartments] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [courses, setCourses] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [currentCourse,setCurrentCourse] = useState(null)
    const [fileType, setFileType] = useState(null)
    const [file, setFile] = useState(null)
    const [already, setAlready] = useState(0)

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
        getAdmin();
    }, [])

    useEffect(()=>{
        const fetchDepartments = async () => {
            if(already>0){
                return
            }
            try{
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/departments`)
                const data = response.data
                setAlready(1)
                setDepartments(data)
            }catch(error){
                setMessage(error.message)
                setPopup(true)
                setSeverity('error')
            }
        };
        fetchDepartments();
    })
    
    const handleDepartmentClick = async (departmentId) => {
        try{
            setSelectedDepartment(departmentId);
            const token = localStorage.getItem('token')
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses`,{ headers:{
                Authorization: `Bearer ${token}`
            },  params: {"department_id": departmentId}, })
            const data = response.data.courses
            setCourses(data)
        }catch(error){
            setMessage(error.message)
            setPopup(true)
            setSeverity('error')
        }
    };
    
    const handleAddFile = (course, type)=>{
        setCurrentCourse(course)
        setFileType(type)
        setOpenDialog(true)
    }
    
    const handleFileChange = (event)=>{
        setFile(event.target.files[0])
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentCourse(null);
        setFile(null); // Limpa o arquivo selecionado
    };

    const handleFileUpload = async () => {
        const token = localStorage.getItem('token')
        if(!file){
            alert("Por favor, selecione um arquivo.")
            return;
        }
        const formData = new FormData();
        formData.append('courseId', currentCourse.id); // Adiciona o ID do curso
        formData.append('file', file); // Adiciona o arquivo

        // Logando os pares chave-valor do FormData
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
        }
        try{
            //const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadFile`, formData)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadFile`, formData,{headers: {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data' // Não defina isso aqui
            }});
            console.log('Upload bem sucedido:' , response.data)
        }catch(error){
            console.error('Erro ao fazer upload do arquivo:', error);
        }
    }

    return (
        <div>
            <Navbar isAdmin = {isAdmin} onLogout={onLogout} />
            <div style={{display: 'flex', height: '100vh'}}>
                <div style={{width: '30%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto'}}>
                    <Typography variant="h6">Departamentos</Typography>
                    { <List>
                        {departments.map((department)=>(
                            <ListItem button key={department.id} onClick={()=>handleDepartmentClick(department.id)}>
                                <ListItemText primary={department.name} />
                            </ListItem>
                        ))}
                    </List> }
                </div>
                <div style={{ width: '70%', padding: '10px', overflowY: 'auto' }}>
                    <Typography variant='h5' gutterBottom>
                        {selectedDepartment ? `Cursos do Departamento ${selectedDepartment}` : 'Selecione um departamento'}
                    </Typography>
                    <List>
                        {courses.map((course) => (
                            <ListItem key={course.id}>
                                <ListItemText primary={course.title} />
                                <Button 
                                    onClick={() => handleAddFile(course, 'PDF')} 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<PictureAsPdfIcon />} 
                                    style={{ display:'flex', minWidth: '0', padding: '8px',marginRight: '8px', textAlign:"center", justifyContent:"center" }} // Estilo para botões pequenos
                                />
                                <Button 
                                    onClick={() => handleAddFile(course, 'PowerPoint')} 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<Slideshow  />} 
                                    style={{ minWidth: '0', padding: '8px', marginRight: '8px' }} // Estilo para botões pequenos
                                />
                                <Button 
                                    onClick={() => handleAddFile(course, 'Video')} 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<VideoLibraryIcon  />} 
                                    style={{ minWidth: '0', padding: '8px', marginRight: '8px' }} // Estilo para botões pequenos
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
                <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {`Adicionar arquivo para ${currentCourse?.title}`}
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleDialogClose}
                            aria-label="close"
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Box sx={{ padding: 2 }}>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept={fileType === 'PDF' ? '.pdf' : fileType === 'PowerPoint' ? '.ppt,.pptx' : '.mp4'}
                            style={{ display: 'block', marginBottom: '16px' }}
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={handleFileUpload} variant="contained" color="primary">
                            Enviar {fileType}
                        </Button>
                        <Button onClick={handleDialogClose} variant="outlined" color="secondary">
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );

}


export default CoursePage