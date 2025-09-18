import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "deliveries";

if (!connectionString) {
    throw new Error("Azure Storage connection string is required");
}

export const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
export const containerClient = blobServiceClient.getContainerClient(containerName);

// Inicializar container se não existir
export async function initializeContainer() {
    try {
        // Criar container sem especificar nível de acesso (padrão é privado)
        await containerClient.createIfNotExists();
        console.log(`Container "${containerName}" is ready`);
    } catch (error) {
        console.error("Error initializing container:", error);
    }
}
