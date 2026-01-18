import { api } from "@/api";

export default new (class UserApi {
    async getUserProfile() {
        try {
            const response = await api.get('/users/me');
            return response.data;
        }
        catch (error) {
            throw new Error('Error fetching user profile');
        }
    }
})();