export class IEmailService {
  /**
   * @param {string} to
   * @param {string} code código de 5 dígitos
   */
  async sendPasswordResetCode(to, code) {
    throw new Error('sendPasswordResetCode must be implemented');
  }
}
