import { userRepository } from "./user.repository.js";
import { User } from "./user.entity.js";

export class UserService {
  async getMe(userId: number): Promise<User> {
    const user = await userRepository.findOne({
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