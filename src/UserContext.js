import React, {createContext, useContext, useState} from 'react'

const UserContext = createContext()

export const UserProvider = ({children}) => {
    const [userId, setUserId] = useState(()=>{
        const savedUserId = localStorage.getItem('userId');
        return savedUserId ? parseInt(savedUserId,10): null;
    })

    return(
        <UserContext.Provider value={{userId, setUserId}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {return useContext(UserContext)}