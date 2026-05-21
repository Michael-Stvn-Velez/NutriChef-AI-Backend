export class IForgotPasswordRepository {
  /**
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async userExistsByEmail(email) {
    throw new Error('userExistsByEmail must be implemented');
  }

  /**
   * @param {string} email
   * @param {string} code
   * @param {Date} expiresAt
   */
  async saveResetCode(email, code, expiresAt) {
    throw new Error('saveResetCode must be implemented');
  }

  /**
   * @param {string} email
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  async isValidResetCode(email, code) {
    throw new Error('isValidResetCode must be implemented');
  }

  /**
   * @param {string} email
   * @param {string} password contraseña en claro
   */
  async updatePasswordAndClearReset(email, password) {
    throw new Error('updatePasswordAndClearReset must be implemented');
  }
}
