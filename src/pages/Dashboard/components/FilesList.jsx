import { Typography, Card, CardContent, Button, Divider, IconButton } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import React, {useState} from "react";
import axios from 'axios'
import './styles.css'


function FilesList({files}){
    const groupedFiles = {
        pdf:files.filter(file=>file.type === 'PDF'),
        video: files.filter(file=>file.type === 'MP4'),
        apresentacao: files.filter(file=> file.type === 'ppw')
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileURL, setFileURL] = useState(null)
    
    const handlePDFSelect = async (file)=>{
        try {
            const token = localStorage.getItem('token')
            await axios.get(`${process.env.REACT_APP_API_URL}/getFile/${file.id}`,{ headers:{
                Authorization: `Bearer ${token}`
            },
                responseType: 'blob'
        }).then(response=>{
                const fileBlob = response.data
                const fileURL = URL.createObjectURL(fileBlob)
                console.log(fileURL)
                setFileURL(fileURL)
                setSelectedFile(file)
            })
        } catch (error) {
            console.log(error)
            setSelectedFile(null)
        }
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
                    <Typography variant="h6" gutterBottom>
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
                                        <Typography variant="h6">
                                            {file.name}
                                        </Typography>
                                        <CardContent style={{padding: '16px', display: 'flex', justifyContent:'flex-end'}}>
                                            <Button className="button" variant="contained" color="primary" href={file.url} target = "_blank" startIcon={<SlideshowIcon/>}>Abrir Apresentação</Button>
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
                                        <Typography variant="h6">
                                            {file.name}
                                        </Typography>
                                        <CardContent style={{padding: '16px', display: 'flex', justifyContent:'flex-end'}}>
                                            <Button className="button" variant="contained" color="primary" href={file.url} target = "_blank" startIcon={<VideoLibraryIcon/>}>Abrir Vídeo</Button>
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
            (<div style={{display: 'flex', marginTop: '25px',justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
                <IconButton  style={{ position:'absolute',top: 0, right: 0, zIndex: 10}}>
                    <ArrowBackIcon />
                </IconButton>
                <div style={{ width: '80%', padding: '10px', textAlign: 'center' }}>    
                    <h3>Exibindo PDF: {selectedFile.name}</h3>
                    <iframe src={fileURL}
                        width="100%"
                        height="600px"
                        style={{ border: 'none' }}
                        title="PDF Viewer"/>
                </div>
            </div>
            )}
        </div>
    )
}

export default FilesList