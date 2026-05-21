export class IRegisterUserRepository {
  /**
   * Verifica si un usuario existe por su email
   * @param {string} email
   * @returns {Promise<boolean>} true si el usuario existe
   */
  async existsUserByEmail(email) {
    throw new Error('existsUserByEmail must be implemented');
  }

  /**
   * Registra un nuevo usuario
   * @param {string} name
   * @param {string} email
   * @param {string} password contraseña en claro
   * @returns {Promise<import('../entities/User.js').User>}
   */
  async registerUser(name, email, password) {
    throw new Error('registerUser must be implemented');
  }
}
