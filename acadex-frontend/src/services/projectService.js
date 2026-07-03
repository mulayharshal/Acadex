import api from '../api/axios';

export const getAllProjects = async () => {
    const response = await api.get('/projects/all');
    return response.data;
};

export const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const getMyProjects = async () => {
    const response = await api.get("/projects/my");
    return response.data;
};

export const searchProjects = async (keyword) => {
    const response = await api.get(`/projects/search?keyword=${keyword}`);
    return response.data;
};

export const likeProject = async (id) => {
    const response = await api.post(`/projects/${id}/like`);
    return response.data;
};

export const saveProject = async (id) => {
    const response = await api.post(`/projects/${id}/save`);
    return response.data;
};

export const commentOnProject = async (id, comment) => {
    const response = await api.post(`/projects/${id}/comment`, { comment });
    return response.data;
};

export const getProjectComments = async (id) => {
    const response = await api.get(`/projects/${id}/comment`);
    return response.data;
};

export const deleteProjectComment = async (projectId, commentId) => {
  const response = await api.delete(
    `/projects/${projectId}/comment/${commentId}`
  );

  return response.data;
};

export const uploadProject = async (formData) => {
    const response = await api.post('/projects/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export const updateProject = async (id, data) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
};

export const getMySavedProjects = async () => {
    const response = await api.get("/projects/saved");
    return response.data;
};