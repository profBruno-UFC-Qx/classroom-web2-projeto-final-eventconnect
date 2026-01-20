import AuthApi from "./api/AuthApi";

class AuthService {
    async login(email, password) {
        return await AuthApi.login(email, password);
    }

    async register(username, email, password) {
        return await AuthApi.register(username, email, password);
    }
}

export default new AuthService();