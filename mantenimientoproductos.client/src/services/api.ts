import axios from 'axios';

// Crea la instancia de Axios
const api = axios.create({
    baseURL: '/api', // Se conecta automáticamente al backend gracias al proxy en vite.config.ts
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    },
});

export default api;
