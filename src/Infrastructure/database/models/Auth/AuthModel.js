import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    passwordHash: { type: String, required: true, select: false },
    resetCode: { type: String, select: false, default: null },
    resetCodeExpiresAt: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

// Modelo 'User' → colección MongoDB 'users' (datos de register y login en el mismo sitio)
export const AuthModel = mongoose.model('User', authSchema);
