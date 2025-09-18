import { containerClient } from "../config/azureStorage";
import { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export class FileUploadService {
    async uploadFile(file: Express.Multer.File, deliveryId: number): Promise<string> {
        try {
            // Gerar nome único para o arquivo
            const fileExtension = file.originalname.split('.').pop();
            const blobName = `delivery-${deliveryId}-${uuidv4()}.${fileExtension}`;
            
            // Obter referência para o blob
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Upload do arquivo
            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: {
                    blobContentType: file.mimetype,
                },
                metadata: {
                    originalName: file.originalname,
                    deliveryId: deliveryId.toString(),
                    uploadDate: new Date().toISOString(),
                }
            });
            
            // Retornar URL do arquivo (sem SAS por enquanto, apenas a URL base)
            return blockBlobClient.url;
        } catch (error) {
            console.error("Error uploading file to Azure Blob Storage:", error);
            throw new Error("Failed to upload file");
        }
    }
    
    // Método para gerar URL com SAS token para acesso temporário
    async generateSasUrl(fileUrl: string, expirationHours: number = 24): Promise<string> {
        try {
            // Extrair nome do blob da URL
            const url = new URL(fileUrl);
            const blobName = url.pathname.split('/').pop();
            
            if (!blobName) {
                throw new Error("Invalid file URL");
            }
            
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Configurar permissões SAS
            const sasOptions = {
                containerName: containerClient.containerName,
                blobName: blobName,
                permissions: BlobSASPermissions.parse("r"), // Apenas leitura
                startsOn: new Date(),
                expiresOn: new Date(new Date().valueOf() + expirationHours * 60 * 60 * 1000),
            };
            
            // Para gerar SAS, você precisaria das credenciais da conta
            // Por enquanto, retornamos a URL normal
            return blockBlobClient.url;
        } catch (error) {
            console.error("Error generating SAS URL:", error);
            return fileUrl;
        }
    }
    
    // Método para baixar arquivo como stream
    async downloadFile(fileUrl: string): Promise<{
        stream: NodeJS.ReadableStream,
        contentType: string,
        fileName: string
    }> {
        try {
            // Extrair nome do blob da URL
            const url = new URL(fileUrl);
            const blobName = url.pathname.split('/').pop();
            
            if (!blobName) {
                throw new Error("Invalid file URL");
            }
            
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Verificar se o arquivo existe
            const exists = await blockBlobClient.exists();
            if (!exists) {
                throw new Error("File not found");
            }
            
            // Obter propriedades do blob
            const properties = await blockBlobClient.getProperties();
            
            // Baixar o arquivo como stream
            const response = await blockBlobClient.download();
            
            if (!response.readableStreamBody) {
                throw new Error("Unable to download file stream");
            }
            
            return {
                stream: response.readableStreamBody,
                contentType: properties.contentType || 'application/octet-stream',
                fileName: properties.metadata?.originalName || blobName
            };
        } catch (error) {
            console.error("Error downloading file from Azure Blob Storage:", error);
            throw new Error("Failed to download file");
        }
    }
    
    async deleteFile(fileUrl: string): Promise<boolean> {
        try {
            // Extrair nome do blob da URL
            const url = new URL(fileUrl);
            const blobName = url.pathname.split('/').pop();
            
            if (!blobName) {
                throw new Error("Invalid file URL");
            }
            
            // Obter referência para o blob
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Deletar o arquivo
            await blockBlobClient.deleteIfExists();
            
            return true;
        } catch (error) {
            console.error("Error deleting file from Azure Blob Storage:", error);
            return false;
        }
    }
}
