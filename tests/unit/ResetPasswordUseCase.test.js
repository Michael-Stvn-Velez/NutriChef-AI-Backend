import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { ResetPasswordUseCase } from '../../src/Application/useCases/Auth/ResetPasswordUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

function createMocks({ isValid = true } = {}) {
  const forgotPasswordRepository = {
    isValidResetCode: mock.fn(async () => isValid),
    updatePasswordAndClearReset: mock.fn(async () => undefined),
  };

  return { forgotPasswordRepository };
}

describe('ResetPasswordUseCase', () => {
  it('actualiza la contraseña con código válido', async () => {
    const { forgotPasswordRepository } = createMocks();
    const useCase = new ResetPasswordUseCase(forgotPasswordRepository);

    const result = await useCase.execute('ANA@Test.COM', ' 12345 ', 'newpass1');

    assert.equal(result.message, 'Contraseña actualizada correctamente');
    assert.equal(forgotPasswordRepository.isValidResetCode.mock.calls[0].arguments[0], 'ana@test.com');
    assert.equal(forgotPasswordRepository.isValidResetCode.mock.calls[0].arguments[1], '12345');
  });

  it('rechaza código con formato incorrecto', async () => {
    const { forgotPasswordRepository } = createMocks();
    const useCase = new ResetPasswordUseCase(forgotPasswordRepository);

    await assertRejectsWithAppError(
      () => useCase.execute('ana@test.com', '1234', 'newpass1'),
      { message: 'El código debe tener 5 dígitos', statusCode: 400 }
    );
  });

  it('rechaza código inválido o expirado', async () => {
    const { forgotPasswordRepository } = createMocks({ isValid: false });
    const useCase = new ResetPasswordUseCase(forgotPasswordRepository);

    await assertRejectsWithAppError(
      () => useCase.execute('ana@test.com', '12345', 'newpass1'),
      { message: 'Código inválido o expirado', statusCode: 400 }
    );
  });
});
