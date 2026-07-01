import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDTO, LoginDTO } from '../dto/auth.dto';
import { AppError } from '../errors/app-error';
import { generateToken } from '../utils/jwt';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(data: RegisterDTO) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new AppError('E-mail já está em uso.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
    });

    const token = generateToken({ id: user.id });

    // Exclui o password_hash do retorno sem ferir a tipagem (usando destructuring)
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const token = generateToken({ id: user.id });
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
