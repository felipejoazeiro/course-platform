import React from "react";
import {List, ListItem, ListItemText} from '@mui/material'

function DepartmentList({departments, handleChangeDepartment}){
    return(
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
    )
}

export default DepartmentList