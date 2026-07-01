import {createContext , useContext, useState} from 'react';

const AuthContext =createContext();


export const AuthProvider =({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user ,setUser] = useState(null);

    const loginUser=(token)=>{
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logoutUser= () =>{
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, user, loginUser, logoutUser, isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth=() => useContext(AuthContext);
