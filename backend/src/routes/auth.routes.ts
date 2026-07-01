import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { validateRequest } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../dto/auth.dto';

const authRoutes = Router();


const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRoutes.post('/register', validateRequest(registerSchema), authController.register);
authRoutes.post('/login', validateRequest(loginSchema), authController.login);

export { authRoutes };
