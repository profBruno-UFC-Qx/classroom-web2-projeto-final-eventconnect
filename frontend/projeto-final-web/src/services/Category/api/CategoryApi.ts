import { api } from "@/api";

export default new (class CategoryApi {
    async getAllCategories(params) {
        try {
            const response = await api.get('/categorias', { params });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching categories');
        }
    }

    async createCategory(nome) {
        try {
            const response = await api.post('/categorias', { nome });
            return response.data;
        } catch (error) {
            throw new Error('Error creating category');
        }
    }

    async updateCategory(id, nome) {
        try {
            const response = await api.put(`/categorias/${id}`, { nome });
            return response.data;
        } catch (error) {
            throw new Error('Error updating category');
        }
    }

    async deleteCategory(id) {
        try {
            const response = await api.delete(`/categorias/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error deleting category');
        }
    }
})();