import { api } from "@/api";

export default new (class InscriptionApi {
    async getAllInscriptions() {
        try {
            const response = await api.get('/inscricoes');
            return response.data;
        } catch (error) {
            throw new Error('Error fetching inscriptions');
        }
    }

    async createInscription(eventId) {
        try {
            const response = await api.post('/inscricoes', { eventId });
            return response.data;
        } catch (error) {
            throw new Error('Error creating inscription');
        }
    }

    async deleteInscription(id) {
        try {
            const response = await api.delete(`/inscricoes/${id}`);
            return response.data;
        }
        catch (error) {
            throw new Error('Error deleting inscription');
        }
    }

})();