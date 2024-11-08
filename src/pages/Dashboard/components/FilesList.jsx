import { Typography, Card, CardContent, Button, Divider, IconButton, Box, CircularProgress } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, {useState} from "react";
import axios from 'axios'
import Reveal from "reveal.js";
import './styles.css'

function FilesList({files}){
    const groupedFiles = {
        pdf:files.filter(file=>file.type === 'PDF'),
        video: files.filter(file=>file.type === 'Video'),
        apresentacao: files.filter(file=> file.type === 'PowerPoint')
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileURL, setFileURL] = useState(null)
    const [fileType, setFileType] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [slidesData, setSlidesData] = useState([])
    
    const handlePDFSelect = async (file)=>{
        try {
            setSelectedFile(file)
            setIsLoading(true)
            const token = localStorage.getItem('token')
            await axios.get(`${process.env.REACT_APP_API_URL}/getFilePDF/${file.id}`,{ headers:{
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        }).then(response=>{
                const fileBlob = response.data
                const fileURL = URL.createObjectURL(fileBlob)
                setFileURL(fileURL)
                setFileType('PDF')
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
            setSelectedFile(null)
            setIsLoading(false)
        }
    }

    const handleVideoSelect= async(file)=>{
        try {
            setSelectedFile(file)
            setIsLoading(true)
            const token = localStorage.getItem('token')
            await axios.get(`${process.env.REACT_APP_API_URL}/getFileVideo/${file.id}`, {headers:{
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        }).then(response=>{
            const fileBlob = response.data
            const fileUrl = URL.createObjectURL(fileBlob)
            setFileURL(fileUrl)
            setFileType('video')
            setIsLoading(false)
        })
        } catch (error) {
            console.log(error)
            setSelectedFile(null)
            setIsLoading(false)
        }
    }

    const handlePowerPointSelect = async(file)=>{
        try {
            setSelectedFile(file)
            setIsLoading(true)
            const token = localStorage.getItem('token')
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getApresentation/${file.id}`, {headers:{
                Authorization: `Bearer ${token}`
            }
            })
            const slidesUrl = `https://docs.google.com/presentation/d/${response.data.slidesFileId}/embed`;
            console.log(slidesUrl)
            setFileType('PowerPoint')
            setFileURL(slidesUrl)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setSelectedFile(null)
            setIsLoading(false)
        }
    }

    const handleBack = () =>{
        setFileURL(null)
        setSelectedFile(null)
        setFileType('')
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    }

    return(
        
        <div style={{width: '85%', padding: '10px', overflowY: 'auto' }}>
            {selectedFile == null ? (<div>
                {groupedFiles.pdf.length > 0 && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        Documentos
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                        {groupedFiles.pdf.map((file)=>(
                            <div key={file.id} style={{ width: 'calc(33.33% - 16px)', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s, box-shadow 0.3s',}}>
                                <Card>
                                    <CardContent style={{ 
                                        flexGrow: 1, 
                                        padding: '16px', 
                                    }}>
                                        <Typography variant="h6" style={{ marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem', color: '#333' }}>
                                            {file.name}
                                        </Typography>
                                        <CardContent style={{padding: '16px', display: 'flex', justifyContent:'flex-end'}}>
                                            <Button className="button" variant="contained" color="primary" target = "_blank" startIcon={<PictureAsPdfIcon/>} onClick={()=>{handlePDFSelect(file)}}>Abrir PDF</Button>
                                        </CardContent>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <Divider sx={{margin: '16px 0'}} />
                </div>
            )}

            {groupedFiles.apresentacao.length > 0 && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        Slides
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {groupedFiles.apresentacao.map((file)=>(
                            <div key={file.id} style={{ 
                                width: 'calc(33.33% - 16px)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%', 
                                borderRadius: '8px', 
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}>
                                <Card>
                                    <CardContent style={{ 
                                        flexGrow: 1, 
                                        padding: '16px', 
                                    }}>
                                        <Typography variant="h6" style={{
                                            marginBottom: '8px', 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis', 
                                            fontSize: '1rem',
                                            color: '#333' 
                                        }}>
                                            {file.name}
                                        </Typography>
                                        <CardContent style={{padding: '16px', display: 'flex', justifyContent:'flex-end'}}>
                                            <Button className="button" variant="contained" color="primary" href={file.url} target = "_blank" startIcon={<SlideshowIcon/>} onClick={()=>handlePowerPointSelect(file)}>Abrir Apresentação</Button>
                                        </CardContent>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <Divider sx={{margin: '16px 0'}} />
                </div>
            )}

            {groupedFiles.video.length > 0 && (
                <div>
                    <Typography variant="h6" gutterBottom>
                        Vídeos
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {groupedFiles.video.map((file)=>(
                            <div key={file.id} style={{ 
                                width: 'calc(33.33% - 16px)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%', 
                                borderRadius: '8px', 
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}>
                                <Card>
                                    <CardContent style={{ 
                                        flexGrow: 1, 
                                        padding: '16px', 
                                    }}>
                                        <Typography variant="h6" style={{
                                            marginBottom: '8px', 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis', 
                                            fontSize: '1rem',
                                            color: '#333' 
                                        }}>
                                            {file.name}
                                        </Typography>
                                        <CardContent style={{padding: '16px', display: 'flex', justifyContent:'flex-end'}}>
                                            <Button className="button" variant="contained" color="primary" href={file.url} target = "_blank" startIcon={<VideoLibraryIcon/>} onClick={()=>{handleVideoSelect(file)}}>Abrir Vídeo</Button>
                                        </CardContent>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <Divider sx={{margin: '16px 0'}} />
                </div>
            )}
            </div>) : 
            (
            isLoading ? 
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" marginTop="15px">
                <CircularProgress size={60} />
            </Box> 
            :
            <div style={{display: 'flex', marginTop: '15px',justifyContent: 'center', alignItems: 'center', height: '80vh', position: 'relative' }}>
                <IconButton onClick={handleBack} style={{ position:'absolute',top: 0, right: 0, zIndex: 10}}>
                    <ArrowBackIcon />
                </IconButton>
                {fileType ==='PDF' ? 
                    <div style={{ width: '80%', padding: '10px', textAlign: 'center' }}>    
                        <h3>Exibindo PDF: {selectedFile.name}</h3>
                        <iframe src={fileURL} width="100%" height="600px" style={{ border: 'none' }} title="PDF Viewer"/>
                    </div>
                    : fileType === 'video' ? 
                    <div style={{ width: '80%', padding: '10px', textAlign: 'center' }}>    
                        <h3>Exibindo Vídeo: {selectedFile.name}</h3>
                        <Box sx={{width: '100%', maxWidth: 1200, marginBottom: 2}}>
                            <video width="80%" height="auto" controls style={{borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
                                <source src={fileURL} type="video/mp4"/>
                            </video>
                        </Box>
                    </div>
                    : fileType === 'PowerPoint' ? 
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <iframe
                            src={fileURL}
                            width="100%"
                            height="600px"
                            title="PowerPoint Viewer"
                        />
                    </div>
                    : 
                        <div>Algo</div>
                }  
            </div>
            )}
        </div>
    )
}

export default FilesList