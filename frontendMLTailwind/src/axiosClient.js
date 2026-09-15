import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5068/api';

// 1. Crear instancia con la URL base de la Web API (.NET)
const axiosClient = axios.create({
    baseURL: API_BASE_URL, // Ajusta el puerto de tu API
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Respuestas (Response Interceptor)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) 
        {
            const status = error.response.status;

            switch (status) {
                case 400:
                    console.error('❌ Error 400: Solicitud incorrecta (Validación).', error.response.data);
                    break;
                case 401:
                    console.error('🔒 Error 401: No autorizado. Redirigiendo a login...');
                    // Ejemplo: localStorage.removeItem('token'); window.location.href = '/login';
                    break;
                case 404:
                    console.error('🔍 Error 404: Recurso no encontrado.');
                    break;
                case 500:
                    console.error('💥 Error 500: Error interno del servidor .NET.');
                    break;
                default:
                    console.error(`⚠️ Error ${status}:`, error.response.data);
            }
        } 
        else if (error.request) 
        {
            // La petición se envió pero no se recibió respuesta (API caída o CORS bloqueado)
            console.error('📡 Error de Red: No se pudo conectar con el servidor .NET.');
        } 
        else 
        {
            console.error('⚡ Error insospechado:', error.message);
        }

        // Retornar la promesa rechazada para que el componente pueda reaccionar si lo necesita
        return Promise.reject(error);
    }
    
);

export default axiosClient;

