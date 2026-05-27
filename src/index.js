import { createApp } from './app.js';
import { RegisterUserUseCase } from './Application/useCases/Auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from './Application/useCases/Auth/LoginUserUseCase.js';
import { RequestForgotPasswordUseCase } from './Application/useCases/Auth/RequestForgotPasswordUseCase.js';
import { ResetPasswordUseCase } from './Application/useCases/Auth/ResetPasswordUseCase.js';
import { RefreshTokenUseCase } from './Application/useCases/Auth/RefreshTokenUseCase.js';
import { CreateRecipeUseCase } from './Application/useCases/Recipe/CreateRecipeUseCase.js';
import { ListRecipesUseCase } from './Application/useCases/Recipe/ListRecipesUseCase.js';
import { GetRecipeByIdUseCase } from './Application/useCases/Recipe/GetRecipeByIdUseCase.js';
import { DeleteRecipeUseCase } from './Application/useCases/Recipe/DeleteRecipeUseCase.js';
import { AuthController } from './Api/controllers/AuthController.js';
import { RecipeController } from './Api/controllers/RecipeController.js';
import { createAuthMiddleware } from './Api/middlewares/authMiddleware.js';
import { connectDatabase } from './Infrastructure/database/connectionDb.js';
import { RegisterUserRepository } from './Infrastructure/repositories/Auth/RegisterUserRepository.js';
import { LoginUserRepository } from './Infrastructure/repositories/Auth/LoginUserRepository.js';
import { ForgotPasswordRepository } from './Infrastructure/repositories/Auth/ForgotPasswordRepository.js';
import { RecipeRepository } from './Infrastructure/repositories/Recipe/RecipeRepository.js';
import { JwtTokenService } from './Infrastructure/services/JwtTokenService.js';
import { GmailEmailService } from './Infrastructure/services/GmailEmailService.js';
import { GeminiRecipeGeneratorService } from './Infrastructure/services/GeminiRecipeGeneratorService.js';
import { env } from './Infrastructure/config/env.js';

async function bootstrap() {
  try {
    if (!env.jwtSecret) {
      console.warn('[config] JWT_SECRET no está definido; el login fallará.');
    }
    if (!env.gmailUser || !env.gmailAppPassword) {
      console.warn(
        '[config] GMAIL_USER o GMAIL_APP_PASSWORD no definidos; forgot-password no enviará correos.'
      );
    }
    if (!env.geminiApiKey) {
      console.warn(
        '[config] GEMINI_API_KEY no está definida; crear recetas fallará.'
      );
    }

    await connectDatabase();

    const registerUserRepository = new RegisterUserRepository();
    const loginUserRepository = new LoginUserRepository();
    const forgotPasswordRepository = new ForgotPasswordRepository();
    const userRecipeRepository = new RecipeRepository();
    const tokenService = new JwtTokenService();
    const emailService = new GmailEmailService();
    const aiRecipeGeneratorService = new GeminiRecipeGeneratorService();

    const registerUserUseCase = new RegisterUserUseCase(registerUserRepository);
    const loginUserUseCase = new LoginUserUseCase(loginUserRepository, tokenService);
    const requestForgotPasswordUseCase = new RequestForgotPasswordUseCase(
      forgotPasswordRepository,
      emailService,
      env.passwordResetCodeExpiresMinutes
    );
    const resetPasswordUseCase = new ResetPasswordUseCase(forgotPasswordRepository);
    const refreshTokenUseCase = new RefreshTokenUseCase(tokenService);

    const createRecipeUseCase = new CreateRecipeUseCase(
      userRecipeRepository,
      aiRecipeGeneratorService
    );
    const listRecipesUseCase = new ListRecipesUseCase(userRecipeRepository);
    const getRecipeByIdUseCase = new GetRecipeByIdUseCase(userRecipeRepository);
    const deleteRecipeUseCase = new DeleteRecipeUseCase(userRecipeRepository);

    const authController = new AuthController(
      registerUserUseCase,
      loginUserUseCase,
      requestForgotPasswordUseCase,
      resetPasswordUseCase,
      refreshTokenUseCase
    );

    const recipeController = new RecipeController(
      createRecipeUseCase,
      listRecipesUseCase,
      getRecipeByIdUseCase,
      deleteRecipeUseCase
    );

    const authMiddleware = createAuthMiddleware(tokenService);

    const app = createApp({
      authController,
      recipeController,
      authMiddleware,
    });

    const server = app.listen(env.port, () => {
      console.log(`Servidor escuchando en http://localhost:${env.port}`);
      console.log(`Register:        POST http://localhost:${env.port}/api/auth/register`);
      console.log(`Login:           POST http://localhost:${env.port}/api/auth/login`);
      console.log(`Refresh token:   POST http://localhost:${env.port}/api/auth/refresh`);
      console.log(`Forgot password: POST http://localhost:${env.port}/api/auth/forgot-password`);
      console.log(`Reset password:  POST http://localhost:${env.port}/api/auth/reset-password`);
      console.log(`Create recipe:   POST http://localhost:${env.port}/api/recipes (auth)`);
      console.log(`List recipes:    GET  http://localhost:${env.port}/api/recipes (auth)`);
      console.log(`Get recipe:      GET  http://localhost:${env.port}/api/recipes/:id (auth)`);
      console.log(`Delete recipe:   DELETE http://localhost:${env.port}/api/recipes/:id (auth)`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `El puerto ${env.port} ya está en uso. Cierra la otra instancia (otra terminal o npm run dev) o cambia PORT en .env`
        );
        process.exit(1);
      }
      console.error('Error al iniciar el servidor:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

bootstrap();
