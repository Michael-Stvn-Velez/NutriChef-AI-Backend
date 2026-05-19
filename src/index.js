import { connectDatabase } from './Infrastructure/database/connectionDb.js';
import { disconnectDatabase } from './Infrastructure/database/disconnectDb.js';

async function bootstrap() {
    try{
        await connectDatabase();
        await disconnectDatabase();

    }catch{
        console.error('Error al iniciar la aplicación:', error.message);
    }
}

bootstrap()