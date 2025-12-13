
import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        // Get auth data from localStorage
        const authData = localStorage.getItem("auth");

        console.log(" authData from localStorage:", authData);

        if (authData) {
            try {
                const auth = JSON.parse(authData);
                console.log("Parsed auth object:", auth);

                // Add JWT token to Authorization header
                if (auth.jwtToken) {
                    config.headers.Authorization = `Bearer ${auth.jwtToken}`;
                    console.log("Interceptor - Token added to header:", config.headers.Authorization.substring(0, 30) + "...");
                } else {
                    console.warn("Interceptor - No jwtToken found in auth object");
                }
            } catch (error) {
                console.error("Error parsing auth data:", error);
            }
        } else {
            console.warn(" No auth data in localStorage");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token might be expired or invalid
            console.error("Authentication error - token may be expired");
            // Optionally clear localStorage and redirect to login
            // localStorage.removeItem("auth");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;