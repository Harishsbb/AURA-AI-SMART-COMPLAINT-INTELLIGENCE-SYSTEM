import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createComplaint = async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
};

export const fetchComplaints = async (token) => {
    const response = await api.get('/complaints', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
export const fetchStats = async (token) => {
    const response = await api.get('/complaints/stats', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateComplaintStatus = async (id, status, token) => {
    const response = await api.put(`/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
};

export default api;
