import UserApi from "./api/UserApi";

class UserService {
    async getUserProfile() {
        return await UserApi.getUserProfile();
    }
}

export default new UserService();