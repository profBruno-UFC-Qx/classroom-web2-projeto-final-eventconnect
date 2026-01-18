import EventApi from "./api/EventApi";

class EventService {
    async getAllEvents(params = {}) {
        return await EventApi.getAllEvents(params);
    }

    async createEvent(data) {
        return await EventApi.createEvent(data);
    }

    async updateEvent(id, data) {
        return await EventApi.updateEvent(id, data);
    }
    
    async deleteEvent(id) {
        return await EventApi.deleteEvent(id);
    }
}

export default new EventService();

