import React, {useState, useEffect} from 'react'

import {List, ListItem, ListItemText, Button, Typography, Dialog, DialogTitle, DialogActions, DialogContent, TextField,IconButton, Box} from '@mui/material'
import Navbar from '../../components/Navbar'
import CloseIcon from '@mui/icons-material/Close';
import { Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Slideshow from '@mui/icons-material/Slideshow'; 
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import axios from 'axios'

function CoursePage({onLogout}){
    const [isAdmin, setIsAdmin] = useState(false)

    const [departments, setDepartments] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [currentCourse,setCurrentCourse] = useState(null)
    const [fileType, setFileType] = useState(null)
    const [file, setFile] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)
    const [files, setFiles] = useState([])
    const [already, setAlready] = useState(0)
    const [newCourse, setNewCourse] = useState('')
    const [popupNewCourse, setPopupNewCourse] = useState(false)
    const [newDescription, setNewDescription] = useState('')
    const [newDepartment, setNewDepartment] = useState('')
    const [popupNewDepartment, setPopupNewDepartment] = useState(false)


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
            setFiles([])
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
    
    const handleChangeFile= (course,type, file)=>{
        setCurrentFile(file)
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
        formData.append('courseId', currentCourse.id); 
        formData.append('type', fileType)
        formData.append('file', file); 

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
        }
        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/${fileType === 'PowerPoint' ? 'uploadPPT' : 'uploadFile'}`, formData,{headers: {
                Authorization: `Bearer ${token}`,
            }});
            console.log('Upload bem sucedido:' , response.data)
            setCurrentFile(null)
            setFile(null)
            handleDialogClose()
        }catch(error){
            console.error('Erro ao fazer upload do arquivo:', error);
            setCurrentFile(null)
            setFile(null)
            handleDialogClose()
        }
    }

    const handleFileUpdate = async () => {
        const formData = new FormData();
        const token = localStorage.getItem('token')
        formData.append('file', file)
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
        }
        try{
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateFile/${selectedCourse}/${currentFile.id}`, formData, {headers: {
                Authorization: `Bearer ${token}`,
            }});

            console.log('Update bem sucedido:', response.data)
            setCurrentFile(null)
            setFile(null)
            handleDialogClose()
        }catch(error){
            console.error('Erro ao fazer o update do arquivo: ', error)
            setCurrentFile(null)
            setFile(null)
            handleDialogClose()        
        }

    }


    const handleFileDelete = async (fileId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/deleteFile/${fileId}`)
            setFiles(files.filter(file => file.id !== fileId))
        } catch (error) {
            console.error('Erro ao deletar arquivo', error)
        }
    }

    const handleCourseClick = async (courseId) => {
        setSelectedCourse(courseId)
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getFiles/${courseId}`)
        setFiles(response.data)
    }

    const handlePPTDelete = async (fileId)=>{
        try{
            await axios.delete(`${process.env.REACT_APP_API_URL}/deletePPT/${fileId}`)
        }catch(error){
            console.error('Erro ao deletar arquivo')
        }
        
    }

    const handleAddNewCourse = async (e)=>{
        try {
            e.preventDefault()
            const token = localStorage.getItem('token')
            const formData = new FormData();
            formData.append('title', newCourse)
            formData.append('description', newDescription)
            formData.append('department_id', selectedDepartment)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/newCourse`, formData, {headers:{
                Authorization: `Bearer ${token}`,
            }})
            console.log(`Adicionado com sucesso! : ${response.data}`)
            setNewCourse('')
            setNewDescription('')
            setMessage(response.data.message)
            setSeverity('success')
            setPopup(true)
            handleDepartmentClick(selectedDepartment)      
        } catch (error) {
            setNewCourse('')
            setNewDescription('')
            setMessage("Erro ao criar novo curso.")
            setSeverity('error')
            setPopup(true)
            handleDepartmentClick(selectedDepartment)      
        }
    }

    const handleAddNewDepartment = async (e)=>{
        try {
            e.preventDefault()
            const token = localStorage.getItem('token')
            console.log(newDepartment)
            const formData = new FormData();
            formData.append('name', newDepartment)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/newDepartment`, formData, {headers:{
                Authorization: `Bearer ${token}`,
            }})
            setMessage(response.data.message)
            setNewDepartment('')
            setSeverity('success')
            setPopup(true)
            handleDepartmentClick(departments[0].id)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <Navbar isAdmin = {isAdmin} onLogout={onLogout}/>
            <div style={{display: 'flex', height: '90vh'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', width: '20%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto'}}>
                    <List>
                        {departments.map((department)=>(
                            <ListItem button key={department.id} onClick={()=>handleDepartmentClick(department.id)}>
                                <ListItemText primary={department.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Button className="button_login" variant="contained" color="primary" fullWidth onClick={()=>setPopupNewDepartment(true)} >Novo departamento</Button>
                </div>
                <div style={{ width: '80%', padding: '10px', overflowY: 'auto' }}>
                    <Typography variant='h5' gutterBottom>
                        {selectedDepartment ? `Cursos do Departamento ${selectedDepartment}` : 'Selecione um departamento'}
                    </Typography>
                    <List>
                        {courses.map((course) => (
                            <ListItem key={course.id}>
                                <ListItemText primary={course.title} onClick={() => handleCourseClick(course.id)} />
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
                    {selectedCourse && (
                        <div>
                            <Typography variant="h6">Arquivos</Typography>
                                <List>
                                    {files.map((file) => (
                                        <ListItem key={file.id}>
                                            <ListItemText primary={`${file.name} (${file.type})`} />
                    
                                            {file.type === "PowerPoint" ? <div></div> :  <Button 
                                                variant="outlined" 
                                                color="primary" 
                                                startIcon={<CloudUploadIcon />} 
                                                onClick={() => {handleChangeFile(selectedCourse, file.type, file); }} 
                                                style={{ marginRight: '8px' }}
                                            >
                                                Substituir
                                            </Button>}
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                startIcon={<DeleteIcon />} 
                                                onClick={() => {file.type === 'PowerPoint' ? handlePPTDelete(file.id) :  handleFileDelete(file.id)}} 
                                            >
                                                Deletar
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        )}
                    {selectedDepartment && (<div style={{display:'flex', justifyContent:'flex-end'}}>
                        <Button onClick={()=>setPopupNewCourse(true)} variant="outlined" size='medium' >Novo Curso</Button>
                    </div>)}
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
                            accept={fileType === 'PDF' ? '.pdf' : fileType === 'PowerPoint' ? '.pptx' : '.mp4'}
                            style={{ display: 'block', marginBottom: '16px' }}
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={ currentFile == null ? handleFileUpload : handleFileUpdate} variant="contained" color="primary">
                            Enviar {fileType}
                        </Button>
                        <Button onClick={handleDialogClose} variant="outlined" color="secondary">
                            Cancelar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open ={popupNewCourse} onClose={()=>setPopupNewCourse(false)} PaperProps={{style: {backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.8)'}}} >
                    <DialogTitle sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">Adicionar Novo Curso</Typography>
                        <IconButton edge="end" color='inherit' onClick={()=>setPopupNewCourse(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            <form onSubmit={handleAddNewCourse}>
                                <TextField required variant="outlined" fullWidth label="Novo Curso" margin="normal" value={newCourse} onChange={(e)=> setNewCourse(e.target.value)}/>
                                <TextField required variant="outlined" multiline fullWidth label="Descrição" margin="normal" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)}/>
                                <Button className="button_login" type="submit" variant="contained" color="primary" fullWidth>Registrar</Button>
                            </form>
                        </Box>
                    </DialogContent>
                </Dialog>
                <Dialog open={popupNewDepartment} onClose={()=>setPopupNewDepartment(false)} PaperProps={{style: {backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.8)'}}}>
                    <DialogTitle sx={{display: 'flex', alignItems:'center', justifyContent: 'space-between'}}>
                        <Typography variant='h6'>Adicionar Novo Departamento</Typography>
                        <IconButton edge="end" color='inherit' onClick={()=>setPopupNewDepartment(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box mt={2}>
                            <form onSubmit = {handleAddNewDepartment}>
                                <TextField required variant="outlined" fullWidth label="Novo departamento" margin="normal" value={newDepartment} onChange={(e)=>setNewDepartment(e.target.value)} />
                                <Button className='button_login' type="submit" variant="contained" color='primary' fullWidth >Registrar</Button>
                            </form>
                        </Box>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );

}


export default CoursePage