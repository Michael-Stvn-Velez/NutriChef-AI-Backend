import { AppError } from '../../../Domain/entities/AppError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateFiveDigitCode() {
  return String(Math.floor(Math.random() * 100000)).padStart(5, '0');
}

export class RequestForgotPasswordUseCase {
  constructor(forgotPasswordRepository, emailService, codeExpiresMinutes = 15) {
    this.forgotPasswordRepository = forgotPasswordRepository;
    this.emailService = emailService;
    this.codeExpiresMinutes = codeExpiresMinutes;
  }

  async execute(email) {
    try {
      const normalizedEmail = email?.trim().toLowerCase() ?? '';

      if (!normalizedEmail) {
        throw new AppError('Email is required', 400);
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        throw new AppError('Invalid email', 400);
      }

      const exists =
        await this.forgotPasswordRepository.userExistsByEmail(normalizedEmail);

      if (!exists) {
        return {
          message:
            'Si el correo está registrado, recibirás un código de recuperación',
        };
      }

      const code = generateFiveDigitCode();
      const expiresAt = new Date(
        Date.now() + this.codeExpiresMinutes * 60 * 1000
      );

      await this.forgotPasswordRepository.saveResetCode(
        normalizedEmail,
        code,
        expiresAt
      );

      await this.emailService.sendPasswordResetCode(normalizedEmail, code);

      return {
        message:
          'Si el correo está registrado, recibirás un código de recuperación',
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error('RequestForgotPasswordUseCase:', error);
      throw new AppError('Error al solicitar recuperación de contraseña', 500);
    }
  }
}
