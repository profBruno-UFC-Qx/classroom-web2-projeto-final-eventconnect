import { userRepository } from "./user.repository.js";
import { User } from "./user.entity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

export class UserService {
  async getMe(userId: string): Promise<User> {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: {
        inscricoes: {
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

  async register(payload: { username: string; email: string; password: string }) {
    const existingEmail = await userRepository.findOne({ where: { email: payload.email } });
    if (existingEmail) throw new Error("Email já cadastrado");

    const existingUsername = await userRepository.findOne({ where: { username: payload.username } });
    if (existingUsername) throw new Error("Username já cadastrado");

    const hashed = await bcrypt.hash(payload.password, 10);

    const user = userRepository.create({
      username: payload.username,
      email: payload.email,
      password: hashed,
      provider: "local",
      confirmed: true,
      blocked: false,
      role: "user",
    });

    const saved = await userRepository.save(user);

    const token = jwt.sign({ id: saved.id }, JWT_SECRET, { expiresIn: "1d" });

    const { password, resetPasswordToken, confirmationToken, ...safeUser } = saved as any;
    return { jwt: token, user: safeUser };
  }

  async login(payload: { email: string; password: string }) {
    if (!payload?.email || !payload?.password) {
      throw new Error("Credenciais inválidas");
    }

    const email = payload.email;

    const user = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("LOWER(user.email) = :email", { email })
      .getOne();

    if (!user) throw new Error("Credenciais inválidas");
    if (user.blocked) throw new Error("Este usuário está bloqueado");
    if (!user.password) throw new Error("Usuário sem senha cadastrada");

    const ok = await bcrypt.compare(payload.password, user.password);
    if (!ok) throw new Error("Credenciais inválidas");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    const { password, resetPasswordToken, confirmationToken, ...safeUser } = user as any;
    return { jwt: token, user: safeUser };
  }
}