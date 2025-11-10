import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { setupSwagger } from "./config/swagger";
import { initializeContainer } from "./config/azureStorage";
import userRoutes from "./routes/UserRoutes";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/ProjectRoutes";
import clientRoutes from "./routes/ClientRoutes";
import deliveryRoutes from "./routes/DeliveryRoutes";
import aiSuggestionRoutes from "./routes/AISuggestionRoutes";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors())
app.use(express.json());

// Health check endpoint for deployment verification
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0"
  });
});

app.use(userRoutes);
app.use(authRoutes);
app.use(clientRoutes)
app.use(projectRoutes)
app.use("/deliveries", deliveryRoutes);
app.use("/ai-suggestions", aiSuggestionRoutes);

setupSwagger(app);

console.log("Iniciando conexões com banco de dados e Azure Storage...");

Promise.all([
  sequelize.sync().then(() => console.log("Banco de dados conectado")),
  initializeContainer().then(() => console.log("Azure Storage conectado"))
]).then(() => {
  console.log("Todos os serviços conectados com sucesso");
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Health check disponível em: http://localhost:${port}/health`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  });
}).catch((error) => {
  console.error("Erro ao conectar serviços:", error);
  process.exit(1);
});
