import { api } from "@/api";

export default new (class EventApi {
    async getAllEvents(params = {}) {
        try {
            const response = await api.get('/eventos', { params });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching events');
        }
    }

    async createEvent(data) {
        try {
            const response = await api.post('/eventos', data);
            return response.data;
        } catch (error) {
            throw new Error('Error creating event');
        }
    }

    async updateEvent(id, data) {
        try {
            const response = await api.put(`/eventos/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error('Error updating event');
        }
    }

    async deleteEvent(id) {
        try {
            const response = await api.delete(`/eventos/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting event');
        }
    }

})();