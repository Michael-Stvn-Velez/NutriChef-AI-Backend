export class ILoginUserRepository {
  /**
   * Valida credenciales y devuelve el usuario (sin tokens; los genera el caso de uso).
   * @param {string} email
   * @param {string} password
   * @returns {Promise<import('../entities/User.js').User | null>} null si las credenciales son inválidas
   */
  async loginUser(email, password) {
    throw new Error('loginUser must be implemented');
  }
}
