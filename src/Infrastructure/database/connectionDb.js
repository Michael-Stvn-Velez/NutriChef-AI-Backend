import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectDatabase() {
    // Verificar si la URI de MongoDB está definida
    if(!env.mongodbUri) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // Conectar a MongoDB
    try{
        await mongoose.connect(env.mongodbUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}