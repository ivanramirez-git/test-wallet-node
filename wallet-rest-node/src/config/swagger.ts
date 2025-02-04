import swaggerJsdoc from 'swagger-jsdoc';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3001';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet Service API',
      version: '1.0.0',
      description: 'REST API Bridge for Wallet SOAP Service',
    },
    servers: [
      {
        url: `http://${host}:${port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);