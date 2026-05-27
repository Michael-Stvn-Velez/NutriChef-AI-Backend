import assert from 'node:assert/strict';

/**
 * @param {() => Promise<unknown>} asyncFn
 * @param {{ message?: string | RegExp, statusCode?: number }} expected
 */
export async function assertRejectsWithAppError(asyncFn, expected) {
  try {
    await asyncFn();
    assert.fail('Se esperaba que la promesa rechazara con AppError');
  } catch (error) {
    assert.equal(error.name, 'AppError', `Se esperaba AppError, se obtuvo ${error.name}`);

    if (expected.statusCode !== undefined) {
      assert.equal(error.statusCode, expected.statusCode);
    }

    if (expected.message instanceof RegExp) {
      assert.match(error.message, expected.message);
    } else if (expected.message !== undefined) {
      assert.equal(error.message, expected.message);
    }
  }
}
