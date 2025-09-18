import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { setupSwagger } from "./config/swagger";
//import { initializeContainer } from "./config/azureStorage";
import userRoutes from "./routes/UserRoutes";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/ProjectRoutes";
import clientRoutes from "./routes/ClientRoutes";
import deliveryRoutes from "./routes/DeliveryRoutes";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors())
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);
app.use(clientRoutes)
app.use(projectRoutes)
app.use("/deliveries", deliveryRoutes);

setupSwagger(app);

sequelize.sync({force: true}).then(() => {
  console.log("Banco de dados conectado");
  app.listen(port, () => console.log("Servidor rodando na porta 3000"));
}).catch((error) => {
  console.error("Erro ao conectar serviços", error);
});
