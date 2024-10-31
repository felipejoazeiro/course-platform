import React from 'react';
import { Navigate} from 'react-router-dom';

const ProtectedRoute = ({children, isAdmin}) => {
    return isAdmin ? children : <Navigate to = "/404"/>
}

export default ProtectedRoute