import { create } from 'zustand'; // Use ES module import
import axios from 'axios';

const API_URL = "http://localhost:3000/api/auth";

// Ensure that cookies are sent with the request (useful for CORS and authentication scenarios)
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, name) => {
        console.log("Signing up...");
        console.log(email, password, name);

        // Start loading and clear previous errors
        set({ isLoading: true, error: null });

        try {
            // Send signup request to backend
            const response = await axios.post(`${API_URL}/signup`, { email, password, name }, {
                validateStatus: (status) => status < 500,  // Treat 4xx errors as valid responses
            });

            // On successful response, update state
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                message: "Signup successful",
            });
        } catch (error) {
            // Handle error response from the backend
            const errorMessage = error.response?.data?.message || error.message || "Error signing up";
            set({ error: errorMessage, isLoading: false });

            // Log the error for debugging
            console.error("Error during signup:", errorMessage);
            throw error;
        }
    },verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
		  const response = await axios.get(`${API_URL}/checkAuth`, { withCredentials: true });
		  console.log("checkAuth response:", response);
		  set({
			user: response.data.user,
			isAuthenticated: true,
			isCheckingAuth: false,
		  });
		} catch (error) {
		  console.error("Error during checkAuth:", error.response || error);
		  set({
			error: null,
			isCheckingAuth: false,
			isAuthenticated: false,
			user: null,
		  });
		}
	  },
	  
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
	
		try {
			// Log for debugging
			console.log("Sending request to:", `${API_URL}/reset/${token}`);
			console.log("Password:", password);
	
			const response = await axios.post(`${API_URL}/reset/${token}`, { password });
	
			// Log the response data for success
			console.log("Response from backend:", response.data);
	
			set({
				message: response.data.message,
				isLoading: false,
			});
		} catch (error) {
			// Check if error response exists and log it
			console.error("Error during reset password:", error.response);
	
			// If response exists, set the error from the response, else use a default error message
			set({
				isLoading: false,
				error: error.response?.data?.message || "Error resetting password",
			});
			throw error;
		}
	},
	
}));
