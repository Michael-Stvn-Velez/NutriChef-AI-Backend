export class AuthController {
  constructor(
    registerUserUseCase,
    loginUserUseCase,
    requestForgotPasswordUseCase,
    resetPasswordUseCase
  ) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.requestForgotPasswordUseCase = requestForgotPasswordUseCase;
    this.resetPasswordUseCase = resetPasswordUseCase;
  }

  register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await this.registerUserUseCase.execute(name, email, password);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } =
      await this.loginUserUseCase.execute(email, password);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        accessToken,
        refreshToken,
      },
    });
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await this.requestForgotPasswordUseCase.execute(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  };

  resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    const result = await this.resetPasswordUseCase.execute(
      email,
      code,
      newPassword
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  };
}
