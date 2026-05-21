import bcrypt from 'bcryptjs';
import { User } from '../../../Domain/entities/User.js';
import { IRegisterUserRepository } from '../../../Domain/interfaces/Auth/IRegisterUserRepository.js';
import { AuthModel } from '../../database/models/Auth/AuthModel.js';

const SALT_ROUNDS = 10;

export class RegisterUserRepository extends IRegisterUserRepository {
  #toEntity(doc) {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      createdAt: doc.createdAt,
    });
  }

  async existsUserByEmail(email) {
    const doc = await AuthModel.exists({ email });
    return doc !== null;
  }

  async registerUser(name, email, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const doc = await AuthModel.create({
      name,
      email,
      passwordHash,
    });

    return this.#toEntity(doc);
  }
}
