import api from '../api/axios';

export const register =async (name, email, password )=>{
    const response= await api.post('auth/register',{name , email, password});
    return response.data;
};

export const login =async(email, password) =>{
    const reponse = await api.post('/auth/login',{email,password});
    return reponse.data;
};