import bcrypt from 'bcryptjs';
import { User } from '../../../Domain/entities/User.js';
import { ILoginUserRepository } from '../../../Domain/interfaces/Auth/ILoginUserRepository.js';
import { AuthModel } from '../../database/models/Auth/AuthModel.js';

export class LoginUserRepository extends ILoginUserRepository {
  #toEntity(doc) {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      createdAt: doc.createdAt,
    });
  }

  async loginUser(email, password) {
    const doc = await AuthModel.findOne({ email }).select('+passwordHash');
    if (!doc) {
      return null;
    }

    const isValid = await bcrypt.compare(password, doc.passwordHash);
    if (!isValid) {
      return null;
    }

    return this.#toEntity(doc);
  }
}
