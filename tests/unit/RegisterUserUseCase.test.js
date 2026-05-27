import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { RegisterUserUseCase } from '../../src/Application/useCases/Auth/RegisterUserUseCase.js';
import { assertRejectsWithAppError } from '../helpers/assertAppError.js';

function createMocks({ existsUser = false, registerResult = { id: '1', name: 'Ana', email: 'ana@test.com' } } = {}) {
  const registerUserRepository = {
    existsUserByEmail: mock.fn(async () => existsUser),
    registerUser: mock.fn(async () => registerResult),
  };

  return { registerUserRepository };
}

describe('RegisterUserUseCase', () => {
  it('registra un usuario válido', async () => {
    const { registerUserRepository } = createMocks();
    const useCase = new RegisterUserUseCase(registerUserRepository);

    const result = await useCase.execute('  Ana  ', 'ANA@Test.COM ', 'secret1');

    assert.deepEqual(result, { id: '1', name: 'Ana', email: 'ana@test.com' });
    assert.equal(registerUserRepository.existsUserByEmail.mock.calls[0].arguments[0], 'ana@test.com');
    assert.equal(registerUserRepository.registerUser.mock.calls[0].arguments[0], 'Ana');
    assert.equal(registerUserRepository.registerUser.mock.calls[0].arguments[1], 'ana@test.com');
  });

  it('rechaza nombre vacío', async () => {
    const { registerUserRepository } = createMocks();
    const useCase = new RegisterUserUseCase(registerUserRepository);

    await assertRejectsWithAppError(() => useCase.execute('', 'a@b.com', '123456'), {
      message: 'Name is required',
      statusCode: 400,
    });
  });

  it('rechaza nombre corto', async () => {
    const { registerUserRepository } = createMocks();
    const useCase = new RegisterUserUseCase(registerUserRepository);

    await assertRejectsWithAppError(() => useCase.execute('ab', 'a@b.com', '123456'), {
      message: 'Name must be at least 3 characters long',
      statusCode: 400,
    });
  });

  it('rechaza email inválido', async () => {
    const { registerUserRepository } = createMocks();
    const useCase = new RegisterUserUseCase(registerUserRepository);

    await assertRejectsWithAppError(() => useCase.execute('Ana', 'no-es-email', '123456'), {
      message: 'Invalid email',
      statusCode: 400,
    });
  });

  it('rechaza contraseña corta', async () => {
    const { registerUserRepository } = createMocks();
    const useCase = new RegisterUserUseCase(registerUserRepository);

    await assertRejectsWithAppError(() => useCase.execute('Ana', 'ana@test.com', '12345'), {
      message: 'Password must be at least 6 characters long',
      statusCode: 400,
    });
  });

  it('rechaza si el usuario ya existe', async () => {
    const { registerUserRepository } = createMocks({ existsUser: true });
    const useCase = new RegisterUserUseCase(registerUserRepository);

    await assertRejectsWithAppError(() => useCase.execute('Ana', 'ana@test.com', '123456'), {
      message: 'User already exists',
      statusCode: 409,
    });
  });
});
