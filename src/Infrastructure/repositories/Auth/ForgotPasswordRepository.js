import bcrypt from 'bcryptjs';
import { IForgotPasswordRepository } from '../../../Domain/interfaces/Auth/IForgotPasswordRepository.js';
import { AuthModel } from '../../database/models/Auth/AuthModel.js';

const SALT_ROUNDS = 10;

export class ForgotPasswordRepository extends IForgotPasswordRepository {
  async userExistsByEmail(email) {
    const doc = await AuthModel.exists({ email });
    return doc !== null;
  }

  async saveResetCode(email, code, expiresAt) {
    await AuthModel.updateOne(
      { email },
      { resetCode: code, resetCodeExpiresAt: expiresAt }
    );
  }

  async isValidResetCode(email, code) {
    const doc = await AuthModel.findOne({ email }).select(
      '+resetCode +resetCodeExpiresAt'
    );

    if (!doc?.resetCode || !doc.resetCodeExpiresAt) {
      return false;
    }

    if (doc.resetCodeExpiresAt < new Date()) {
      return false;
    }

    return doc.resetCode === code;
  }

  async updatePasswordAndClearReset(email, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await AuthModel.updateOne(
      { email },
      {
        passwordHash,
        resetCode: null,
        resetCodeExpiresAt: null,
      }
    );
  }
}
