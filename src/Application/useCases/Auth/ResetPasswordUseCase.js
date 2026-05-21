import { AppError } from '../../../Domain/entities/AppError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{5}$/;

export class ResetPasswordUseCase {
  constructor(forgotPasswordRepository) {
    this.forgotPasswordRepository = forgotPasswordRepository;
  }

  async execute(email, code, newPassword) {
    try {
      const normalizedEmail = email?.trim().toLowerCase() ?? '';
      const normalizedCode = String(code ?? '').trim();
      const plainPassword = newPassword ?? '';

      if (!normalizedEmail) {
        throw new AppError('Email is required', 400);
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new AppError('Invalid email', 400);
      }

      if (!CODE_REGEX.test(normalizedCode)) {
        throw new AppError('El código debe tener 5 dígitos', 400);
      }

      if (!plainPassword) {
        throw new AppError('Password is required', 400);
      }

      if (plainPassword.length < 6) {
        throw new AppError('Password must be at least 6 characters long', 400);
      }

      const isValid = await this.forgotPasswordRepository.isValidResetCode(
        normalizedEmail,
        normalizedCode
      );

      if (!isValid) {
        throw new AppError('Código inválido o expirado', 400);
      }

      await this.forgotPasswordRepository.updatePasswordAndClearReset(
        normalizedEmail,
        plainPassword
      );

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('ResetPasswordUseCase:', error);
      throw new AppError('Error al restablecer la contraseña', 500);
    }
  }
}
