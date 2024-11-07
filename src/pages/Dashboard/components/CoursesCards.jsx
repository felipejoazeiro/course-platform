import React from "react";
import {CardContent, Typography, Chip, Card} from '@mui/material'

function CoursesCards({selectedDepartment, courses, handleCardClick}){
    return(
        <div style={{ width: '85%', padding: '10px', overflowY: 'auto' }}>
            <Typography variant='h5' gutterBottom>
                {selectedDepartment === null ? '' : `Cursos de ${selectedDepartment}`}
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <Card 
                            key={index} 
                            onClick={()=> handleCardClick(course.id)}
                            style={{ 
                                width: 'calc(33.33% - 16px)', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%', 
                                borderRadius: '8px', 
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
                                transition: 'transform 0.3s, box-shadow 0.3s',
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
                                justifyContent: 'flex-end' 
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
    )
}

export default CoursesCards