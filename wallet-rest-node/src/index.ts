import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import env from './config/env';
import walletRoutes from './routes/walletRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use('/api/wallet', walletRoutes);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.PORT, () => {
  const host = env.HOST || 'localhost';
  console.log(`Server is running on port ${env.PORT} at http://${host}:${env.PORT}`);
  console.log(`Swagger documentation available at http://${host}:${env.PORT}/api-docs`);
});