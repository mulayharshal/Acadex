import api from '../api/axios';

export const getAllNotes = async () => {
    const response = await api.get('/notes/all');
    return response.data;
};

export const getNoteById = async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
};

export const getMyNotes = async () => {
    const response = await api.get('/notes/my');
    return response.data;
};

export const searchNotes = async (keyword) => {
    const response = await api.get(`/notes/search?keyword=${keyword}`);
    return response.data;
};

export const likeNote = async (id) => {
    const response = await api.post(`/notes/${id}/like`);
    return response.data;
};

export const saveNote = async (id) => {
    const response = await api.post(`/notes/${id}/save`);
    return response.data;
};

export const commentOnNote = async (id, comment) => {
    const response = await api.post(`/notes/${id}/comment`, { comment });
    return response.data;
};

export const getComments = async (id) => {
    const response = await api.get(`/notes/${id}/comment`);
    return response.data;
};

export const deleteComment = async (noteId, commentId) => {
  const response = await api.delete(`/notes/${noteId}/comment/${commentId}`);
  return response.data;
};

export const uploadNote = async (formData) => {
    const response = await api.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteNote = async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
};

export const updateNote = async (id, data) => {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data;
};

export const getMySavedNotes = async () => {
    const response = await api.get("/notes/saved");
    return response.data;
};