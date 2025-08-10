// src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import datasetRoutes from '@/routes/dataset.routes';
import transactionRoutes from '@/routes/transaction.routes';

// Import middleware
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';

// Load env files
dotenv.config();
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
}

class App {
  public app: Application;

  constructor() {
    this.app = express();

    // Health check – registered BEFORE any middleware
    this.app.get('/health', (req: Request, res: Response) => {
      console.log('🩺 Healthcheck hit');
      res.status(200).json({
        status: 'success',
        message: 'BlockMarketAI Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
      });
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security headers
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // Body parsing
    this.app.use(
      express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' })
    );
    this.app.use(
      express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10mb' })
    );

    // Static files
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  }

  private initializeRoutes(): void {
    const apiPrefix = process.env.API_PREFIX || '/api/v1';

    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);
    this.app.use(`${apiPrefix}/datasets`, datasetRoutes);
    this.app.use(`${apiPrefix}/transactions`, transactionRoutes);

    // API info endpoint
    this.app.get(apiPrefix, (req: Request, res: Response) => {
      res.status(200).json({
        name: 'BlockMarketAI API',
        version: process.env.npm_package_version || '1.0.0',
        description: 'Decentralized Data Marketplace API',
        endpoints: {
          auth: `${apiPrefix}/auth`,
          users: `${apiPrefix}/users`,
          datasets: `${apiPrefix}/datasets`,
          transactions: `${apiPrefix}/transactions`,
        },
        documentation: 'Coming soon…',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
