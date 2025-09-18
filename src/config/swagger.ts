import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FreeLog",
      version: "1.0.0",
      description: "",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    security: {
      bearerAuth: []
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserPostRequest: {
          type: "object",
          properties: {
            name: {type: "string", example: "João Matheus"},
            email: {type: "string", example: "joaomatheus@gmail.com"},
            password: {type: "string", example: "12345678Jm!"},
          },
          required: ["name", "email", "password"],
        },
        UserPutRequest: {
          type: "object",
          properties: {
            name: {type: "string", example: "João Matheus Villarim"},
            email: {type: "string", example: "joaomatheus@gmail.com"},
            password: {type: "string", example: "12345678Jm!"},
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: {type: "number", example: "1"},
            name: {type: "string", example: "João Matheus Villarim"},
            email: {type: "string", example: "joaomatheus@gmail.com"},
            password: {type: "string", example: "12345678Jm!"},
          },
        },

        Login: {
          type: "object",
          properties: {
            email: {type: "string", example: "joaomatheus@gmail.com"},
            password: {type: "string", example: "12345678Jm!"},
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {type: "string", example: "Login bem-sucedido."},
            token: {type: "string", example: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"},
          },
        },
      },
    }
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
