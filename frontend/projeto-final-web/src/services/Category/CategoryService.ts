import CategoryApi from "./api/CategoryApi";

class CategoryService {
    async getAllCategories(params) {
        return await CategoryApi.getAllCategories(params);
    }

    async createCategory(nome) {
        return await CategoryApi.createCategory(nome);
    }

    async updateCategory(id, nome) {
        return await CategoryApi.updateCategory(id, nome);
    }

    async deleteCategory(id) {
        return await CategoryApi.deleteCategory(id);
    }
}

export default new CategoryService();