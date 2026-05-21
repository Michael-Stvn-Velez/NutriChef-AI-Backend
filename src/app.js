import cors from 'cors';
import express from 'express';
import { createApiRouter } from './Api/routes/apiRouter.js';
import { errorHandler } from './Api/middlewares/errorHandler.js';
import { jsonParseErrorHandler } from './Api/middlewares/jsonParseErrorHandler.js';

export function createApp(dependencies) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(jsonParseErrorHandler);

  app.use('/api', createApiRouter(dependencies));

  app.use(errorHandler);

  return app;
}
