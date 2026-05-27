import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { RefreshTokenUseCase } from '../../src/Application/useCases/Auth/RefreshTokenUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

describe('RefreshTokenUseCase', () => {
  it('genera nuevos tokens con refresh válido', async () => {
    const tokenService = {
      verifyRefreshToken: mock.fn(() => ({ userId: 'u1', email: 'ana@test.com' })),
      generateAccessToken: mock.fn(() => 'new-access'),
      generateRefreshToken: mock.fn(() => 'new-refresh'),
    };

    const useCase = new RefreshTokenUseCase(tokenService);
    const result = await useCase.execute('  old-refresh  ');

    assert.equal(result.accessToken, 'new-access');
    assert.equal(result.refreshToken, 'new-refresh');
    assert.equal(tokenService.verifyRefreshToken.mock.calls[0].arguments[0], 'old-refresh');
  });

  it('rechaza refresh token vacío', async () => {
    const tokenService = {
      verifyRefreshToken: mock.fn(),
      generateAccessToken: mock.fn(),
      generateRefreshToken: mock.fn(),
    };

    const useCase = new RefreshTokenUseCase(tokenService);

    await assertRejectsWithAppError(() => useCase.execute('   '), {
      message: 'Refresh token is required',
      statusCode: 401,
    });
  });

  it('rechaza payload sin userId', async () => {
    const tokenService = {
      verifyRefreshToken: mock.fn(() => ({ email: 'ana@test.com' })),
      generateAccessToken: mock.fn(),
      generateRefreshToken: mock.fn(),
    };

    const useCase = new RefreshTokenUseCase(tokenService);

    await assertRejectsWithAppError(() => useCase.execute('token'), {
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  });

  it('mapea TokenExpiredError a 401', async () => {
    const tokenService = {
      verifyRefreshToken: mock.fn(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      }),
      generateAccessToken: mock.fn(),
      generateRefreshToken: mock.fn(),
    };

    const useCase = new RefreshTokenUseCase(tokenService);

    await assertRejectsWithAppError(() => useCase.execute('expired'), {
      message: 'Refresh token has expired',
      statusCode: 401,
    });
  });
});
