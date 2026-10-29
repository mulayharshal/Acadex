import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const loginUser = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    const logoutUser = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const isLoggedIn = !!token;

    // ======= Listen for token-expired event from axios interceptor =======
    useEffect(() => {
        const handleTokenExpired = () => {
            logoutUser();
            navigate('/login', { replace: true, state: { sessionExpired: true } });
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('auth:token-expired', handleTokenExpired);
        };
    }, [logoutUser, navigate]);

    return (
        <AuthContext.Provider value={{ token, user, loginUser, logoutUser, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
