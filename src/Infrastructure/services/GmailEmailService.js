import nodemailer from 'nodemailer';
import { IEmailService } from '../../Domain/interfaces/Auth/IEmailService.js';
import { env } from '../config/env.js';

export class GmailEmailService extends IEmailService {
  #transporter;

  constructor() {
    super();
    this.#transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.gmailUser,
        pass: env.gmailAppPassword,
      },
    });
  }

  async sendPasswordResetCode(to, code) {
    if (!env.gmailUser || !env.gmailAppPassword) {
      throw new Error(
        'GMAIL_USER y GMAIL_APP_PASSWORD deben estar definidos en .env'
      );
    }

    const minutes = env.passwordResetCodeExpiresMinutes;

    await this.#transporter.sendMail({
      from: `"NutriChef AI" <${env.gmailFrom}>`,
      to,
      subject: 'Código de recuperación de contraseña',
      text: `Tu código de recuperación es: ${code}\n\nVálido por ${minutes} minutos. Si no solicitaste este cambio, ignora este correo.`,
      html: `
        <p>Tu código de recuperación de contraseña es:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>Válido por <strong>${minutes} minutos</strong>.</p>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `,
    });
  }
}
