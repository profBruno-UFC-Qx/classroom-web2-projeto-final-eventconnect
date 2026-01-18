import InscriptionApi from "./api/InscriptionApi";

class InscriptionService {
    async getAllInscriptions() {
        return await InscriptionApi.getAllInscriptions();
    }

    async createInscription(eventId) {
        return await InscriptionApi.createInscription(eventId);
    }
    
    async deleteInscription(id) {
        return await InscriptionApi.deleteInscription(id);
    }
}

export default new InscriptionService();