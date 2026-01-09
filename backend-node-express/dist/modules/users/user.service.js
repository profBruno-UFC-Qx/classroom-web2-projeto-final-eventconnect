"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_js_1 = require("./user.repository.js");
class UserService {
    async getMe(userId) {
        const user = await user_repository_js_1.userRepository.findOne({
            where: { id: userId },
            relations: {
                inscricaos: {
                    evento: {
                        categoria: true
                    }
                }
            },
        });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        if (user.blocked) {
            throw new Error("Este usuário está bloqueado");
        }
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map