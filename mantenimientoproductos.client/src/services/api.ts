import axios from 'axios';

// Crea la instancia de Axios
const api = axios.create({
    baseURL: '/api', // Se conecta autom�ticamente al backend gracias al proxy en vite.config.ts
});

export default api;