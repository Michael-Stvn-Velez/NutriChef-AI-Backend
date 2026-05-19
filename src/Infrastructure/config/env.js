import 'dotenv/config';

export const env = {
  mongodbUri: process.env.MONGODB_URI ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};