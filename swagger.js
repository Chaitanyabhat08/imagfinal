const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Machine Hack API Documentation',
      version: '1.0.0',
      description: 'API documentation Machine Hack ',
    },
    servers: [
      {
      url: "http://localhost:3000"
      }
    ]
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
