import 'dotenv/config';

export const env = {
  // Server
  port: Number(process.env.PORT) || 3000,
  // MongoDB
  mongodbUri: process.env.MONGODB_URI ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // JWT
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiration: process.env.JWT_EXPIRATION ?? '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? '',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
  // Gmail (recuperación de contraseña)
  gmailUser: process.env.GMAIL_USER ?? '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD ?? '',
  gmailFrom: process.env.GMAIL_FROM ?? process.env.GMAIL_USER ?? '',
  passwordResetCodeExpiresMinutes:
    Number(process.env.PASSWORD_RESET_CODE_EXPIRES_MINUTES) || 15,
  // Gemini (generación de recetas)
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
};