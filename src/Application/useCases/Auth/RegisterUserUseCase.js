import { AppError } from '../../../Domain/entities/AppError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUserUseCase {
  constructor(registerUserRepository) {
    this.registerUserRepository = registerUserRepository;
  }

  async execute(name, email, password) {
    try {
      const trimmedName = name?.trim() ?? '';
      const normalizedEmail = email?.trim().toLowerCase() ?? '';
      const plainPassword = password ?? '';

      if (!trimmedName) {
        throw new AppError('Name is required', 400);
      }

      if (trimmedName.length < 3) {
        throw new AppError('Name must be at least 3 characters long', 400);
      }

      if (!normalizedEmail) {
        throw new AppError('Email is required', 400);
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new AppError('Invalid email', 400);
      }

      if (!plainPassword) {
        throw new AppError('Password is required', 400);
      }

      if (plainPassword.length < 6) {
        throw new AppError('Password must be at least 6 characters long', 400);
      }

      const existsUser =
        await this.registerUserRepository.existsUserByEmail(normalizedEmail);
      if (existsUser) {
        throw new AppError('User already exists', 409);
      }

      return await this.registerUserRepository.registerUser(
        trimmedName,
        normalizedEmail,
        plainPassword
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.code === 11000) {
        throw new AppError('User already exists', 409);
      }

      console.error('RegisterUserUseCase:', error);
      throw new AppError('Error registering user', 500);
    }
  }
}
