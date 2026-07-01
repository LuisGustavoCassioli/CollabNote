import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../dto/auth.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.authService.register(data);
      return res.status(201).json(result); // Use return
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.authService.login(data);
      return res.status(200).json(result); // Use return
    } catch (error) {
      next(error);
    }
  };
}
