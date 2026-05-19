import mongoose from 'mongoose';

// Desconectar de MongoDB
export async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}