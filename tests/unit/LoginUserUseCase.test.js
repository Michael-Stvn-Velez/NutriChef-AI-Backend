import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { LoginUserUseCase } from '../../src/Application/useCases/Auth/LoginUserUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

function createMocks({ user = { id: 'u1', email: 'ana@test.com', name: 'Ana' } } = {}) {
  const loginUserRepository = {
    loginUser: mock.fn(async () => user),
  };

  const tokenService = {
    generateAccessToken: mock.fn(() => 'access-token'),
    generateRefreshToken: mock.fn(() => 'refresh-token'),
  };

  return { loginUserRepository, tokenService };
}

describe('LoginUserUseCase', () => {
  it('devuelve usuario y tokens con credenciales válidas', async () => {
    const { loginUserRepository, tokenService } = createMocks();
    const useCase = new LoginUserUseCase(loginUserRepository, tokenService);

    const result = await useCase.execute('  ANA@Test.COM ', 'secret1');

    assert.equal(result.user.id, 'u1');
    assert.equal(result.accessToken, 'access-token');
    assert.equal(result.refreshToken, 'refresh-token');
    assert.equal(loginUserRepository.loginUser.mock.calls[0].arguments[0], 'ana@test.com');
    assert.deepEqual(tokenService.generateAccessToken.mock.calls[0].arguments[0], {
      userId: 'u1',
      email: 'ana@test.com',
    });
  });

  it('rechaza credenciales inválidas', async () => {
    const { loginUserRepository, tokenService } = createMocks({ user: null });
    const useCase = new LoginUserUseCase(loginUserRepository, tokenService);

    await assertRejectsWithAppError(() => useCase.execute('ana@test.com', 'wrong'), {
      message: 'Invalid email or password',
      statusCode: 401,
    });
  });

  it('rechaza email vacío', async () => {
    const { loginUserRepository, tokenService } = createMocks();
    const useCase = new LoginUserUseCase(loginUserRepository, tokenService);

    await assertRejectsWithAppError(() => useCase.execute('', 'secret1'), {
      message: 'Email is required',
      statusCode: 400,
    });
  });
});
