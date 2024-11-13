import React, {useState, useEffect} from 'react'
import {Table, Paper, TablePagination, Box, IconButton, TableContainer, TableHead, TableRow, TableCell, TableBody, Collapse, Typography} from '@mui/material'
import PropTypes from 'prop-types'
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns'
import Navbar from '../../components/Navbar'
import axios from 'axios'
import { useTheme } from '@emotion/react'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

function ManagerPage({onLogout}){
    const[isAdmin, setIsAdmin] = useState(false)
    const[page,setPage] = useState(0)
    const[rowsPerPage, setRowsPerPage] = useState(5)
    const[listEmployee, setListEmployee] = useState([])
    const[newName, setNewName] = useState('')
    const[newRegister, setNewRegister] = useState('')
    const[newDialog, setNewDialog] = useState(false)
    const[open, setOpen]=useState(false)

    const[message, setMessage] = useState('')
    const[severity, setSeverity] = useState('')
    const[popUp, setPopup]= useState(false)

    const token = localStorage.getItem('token')

    useEffect(()=>{
        const getAdmin = async ()=>{
            try {
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
    }, [token])

    useEffect(()=>{
        const getEmployeeList = async ()=>{
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employee/completed_courses`, {headers: {
                    Authorization: `Bearer ${token}`
                }})
                setListEmployee(response.data.lista)
            } catch (error) {
                setMessage(error.message)
                setPopup(true)
                setSeverity('error')
            }
        }
        getEmployeeList()
    },[token])


    function TablePaginationActions(props){
        const theme = useTheme()
        const {count, page, rowsPerPage, onPageChange} = props

        const handleFirstPageButton = (event)=>{
            onPageChange(event,0)
        }

        const handleBackButtonClick = (event)=>{
            onPageChange(event, page-1)
        }

        const handleNextButtonClick = (event)=>{
            onPageChange(event, page +1)
        }

        const handleLastPageButton = (event)=>{
            onPageChange(event, Math.max(0, Math.ceil(count/rowsPerPage)-1))
        }

        return (
            <Box sx={{flexShrink:0, ml:2.5}}>
                <IconButton onClick={handleFirstPageButton} disabled={page===0} aria-label='first page'>
                    {theme.direction === 'rtl' ? <LastPageIcon/>:<FirstPageIcon/>}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page===0} aria-label='previous page' >
                    {theme.direction ==='rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </IconButton>
                <IconButton onClick={handleNextButtonClick} disabled={page>=Math.ceil(count/rowsPerPage)-1} aria-label="next page">
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton onClick={handleLastPageButton} disabled={page>Math.ceil(count/rowsPerPage)-1}>
                    {theme.direction==='rtl'?<FirstPageIcon/>:<LastPageIcon/>}
                </IconButton>
            </Box>
        )
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired
    }

    const emptyRows= page>0 ? Math.max(0, (1+page) * rowsPerPage - listEmployee.length) : 0
    
    const handleChangePage = (event,newPage)=>{
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event)=>{
        setRowsPerPage(parseInt(event.target.value,10))
        setPage(0)
    }

    const columns = [
        {id: 'icon', label: '', minWidth:25},
        {id: 'name', label: 'Nome', minWidth: 170},
        {id: 'register', label: 'Matricula', minWidth:170},
        {id: 'email', label: 'E-mail', minWidth: 170}
    ]

    const coursesCompletedColumns = [
        {id: 'department_name', label: 'Departamento', minWidth:150},
        {id: 'title', label: 'Curso', minWidth:150},
        {id: 'completion_date', label: 'Conclusão', minWidth:150},
        {id: 'function', label: 'Funções', minWidth:80}
    ]

    function Row(props){
        const {row} = props;
        const [open, setOpen] = useState(false)

        return(
            <React.Fragment>
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column)=>{
                        const value = row[column.id]
                        return (
                        column.id === 'icon' ? (
                        <TableCell>
                            <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                            >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </TableCell>):(
                        <TableCell key={column.id}>
                            {value}
                        </TableCell>)
                        )
                    })}
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom:0, paddingTop: 0}} colSpan={6} >
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{margin:1}} style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Cursos Completos
                                </Typography>
                                <Table size='small' aria-label="collapsible table" sx={{maxWidth:1050}}>
                                    <TableHead> 
                                        <TableRow>
                                            {coursesCompletedColumns.map((column)=>{
                                                return(<TableCell style={{minWidth:column.minWidth, fontSize:'18px'}}>{column.label}</TableCell>)
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.courses.map((course)=>{
                                            return(
                                                <TableRow>
                                                    {coursesCompletedColumns.map((column)=>{
                                                        const value = course[column.id]

                                                        return column.id === 'completion_date' ? <TableCell>{format(new Date(value), "dd/MM/yyyy HH:mm")}</TableCell> : <TableCell>{value}</TableCell>
                                                    })}
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }

    return(
        <div>
            <Navbar isAdmin={isAdmin} onLogout={onLogout}/>
            <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                <TableContainer component={Paper} sx={{maxWidth:'150vh'}} style={{marginTop:'75px'}}>
                    <Table stickHeader sx={{minWidth: 500, maxWidth:1050}} aria-label="custom pagination table" >
                        <TableHead>
                            <TableRow>
                                {columns.map((column)=>(
                                    <TableCell key={column.id} style={{minWidth:column.minWidth}}>{column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listEmployee.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage).map((row)=>
                                (<Row key={row.id} row={row}/>)
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 53 * emptyRows}} >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination 
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOption={[5,10,25, {label: 'All', value:-1}]} 
                    colSpan={3}
                    component="div" 
                    count={listEmployee.length} 
                    page={page} 
                    slotProps={{select:{inputProps:{'aria-label': 'rows per page',}, native: true}}}
                    onPageChange={handleChangePage} 
                    onRowsPerPageChange={handleChangeRowsPerPage} 
                    ActionsComponent={TablePaginationActions}
                />
            </div>
        </div>
    )
}

export default ManagerPage