import { api } from "@/api";

export default new (class UserApi {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        }
        catch (error) {
            throw new Error('Error logging in');
        }
    }

    async register(username, email, password) {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            return response.data;
        }
        catch (error) {
            throw new Error('Error registering user');
        }
    }
})();