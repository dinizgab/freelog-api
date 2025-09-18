#!/bin/bash

# Azure Setup Script for Freelog Project
# Este script configura todos os recursos necessários no Azure

set -e  # Exit on any error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
RESOURCE_GROUP="freelog-rg"
LOCATION="eastus2"  # Região mais compatível
ACR_NAME="freelogacr$(date +%s)"  # Nome único
DB_SERVER_NAME="freelog-db-server-$(date +%s)"  # Nome único
DB_ADMIN_USER="freelogadmin"
DB_NAME="freelog"
STORAGE_ACCOUNT="freelogstorage$(date +%s)"

echo -e "${BLUE}🚀 Iniciando setup do Azure para o projeto Freelog${NC}"
echo "=================================================="
echo -e "${YELLOW}📋 Configurações:${NC}"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Container Registry: $ACR_NAME"
echo "Database Server: $DB_SERVER_NAME"
echo ""

# Verificar se está logado no Azure
echo -e "${YELLOW}📋 Verificando login no Azure...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${RED}❌ Você não está logado no Azure. Execute 'az login' primeiro.${NC}"
    exit 1
fi

SUBSCRIPTION_ID=$(az account show --query id --output tsv)
echo -e "${GREEN}✅ Logado no Azure. Subscription ID: $SUBSCRIPTION_ID${NC}"

# Registrar providers necessários
echo -e "${YELLOW}🔧 Registrando providers Azure...${NC}"
az provider register --namespace Microsoft.DBforPostgreSQL
az provider register --namespace Microsoft.ContainerRegistry
az provider register --namespace Microsoft.ContainerInstance
az provider register --namespace Microsoft.Storage
echo -e "${GREEN}✅ Providers registrados${NC}"

# Verificar região disponível para PostgreSQL
echo -e "${YELLOW}🌍 Verificando disponibilidade da região...${NC}"
if ! az postgres flexible-server list-skus --location $LOCATION &> /dev/null; then
    echo -e "${YELLOW}⚠️  Região $LOCATION não disponível para PostgreSQL. Tentando eastus2...${NC}"
    LOCATION="eastus2"
    if ! az postgres flexible-server list-skus --location $LOCATION &> /dev/null; then
        echo -e "${YELLOW}⚠️  Tentando westus2...${NC}"
        LOCATION="westus2"
        if ! az postgres flexible-server list-skus --location $LOCATION &> /dev/null; then
            echo -e "${RED}❌ Nenhuma região disponível encontrada. Tente manualmente.${NC}"
            exit 1
        fi
    fi
fi
echo -e "${GREEN}✅ Usando região: $LOCATION${NC}"

# Criar Resource Group
echo -e "${YELLOW}📦 Criando Resource Group...${NC}"
az group create --name $RESOURCE_GROUP --location $LOCATION
echo -e "${GREEN}✅ Resource Group '$RESOURCE_GROUP' criado${NC}"

# Criar Azure Container Registry
echo -e "${YELLOW}🐳 Criando Azure Container Registry...${NC}"
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name $ACR_NAME \
    --sku Basic \
    --admin-enabled true
echo -e "${GREEN}✅ Azure Container Registry '$ACR_NAME' criado${NC}"

# Criar Azure Storage Account
echo -e "${YELLOW}💾 Criando Azure Storage Account...${NC}"
az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --kind StorageV2
echo -e "${GREEN}✅ Storage Account '$STORAGE_ACCOUNT' criado${NC}"

# Criar container blob
echo -e "${YELLOW}📁 Criando container blob...${NC}"
az storage container create \
    --name deliveries \
    --account-name $STORAGE_ACCOUNT \
    --public-access off
echo -e "${GREEN}✅ Container 'deliveries' criado${NC}"

# Obter connection string do storage
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --output tsv)

# Criar PostgreSQL Server
echo -e "${YELLOW}🗄️  Criando PostgreSQL Server...${NC}"
echo "Por favor, digite uma senha segura para o banco de dados:"
read -s DB_PASSWORD

az postgres flexible-server create \
    --resource-group $RESOURCE_GROUP \
    --name $DB_SERVER_NAME \
    --admin-user $DB_ADMIN_USER \
    --admin-password "$DB_PASSWORD" \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --public-access 0.0.0.0 \
    --storage-size 32 \
    --version 14

echo -e "${GREEN}✅ PostgreSQL Server '$DB_SERVER_NAME' criado${NC}"

# Criar database
echo -e "${YELLOW}🗃️  Criando database...${NC}"
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $DB_SERVER_NAME \
    --database-name $DB_NAME

echo -e "${GREEN}✅ Database '$DB_NAME' criado${NC}"

# Criar Service Principal para GitHub Actions
echo -e "${YELLOW}🔐 Criando Service Principal para GitHub Actions...${NC}"
SP_NAME="freelog-github-actions"
SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"

AZURE_CREDENTIALS=$(az ad sp create-for-rbac \
    --name $SP_NAME \
    --role contributor \
    --scopes $SCOPE \
    --sdk-auth)

echo -e "${GREEN}✅ Service Principal '$SP_NAME' criado${NC}"

# Obter Service Principal ID para configurar permissões específicas
SP_OBJECT_ID=$(echo $AZURE_CREDENTIALS | jq -r '.clientId')
echo -e "${YELLOW}🔑 Configurando permissões específicas para ACR...${NC}"

# Adicionar permissões específicas do Container Registry
az role assignment create \
    --assignee $SP_OBJECT_ID \
    --role "AcrPush" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"

az role assignment create \
    --assignee $SP_OBJECT_ID \
    --role "AcrPull" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"

echo -e "${GREEN}✅ Permissões ACR configuradas${NC}"

# Obter senha do ACR
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv)

# Gerar JWT Secret aleatório
JWT_SECRET=$(openssl rand -base64 32)

echo -e "${BLUE}📋 RESUMO DA CONFIGURAÇÃO${NC}"
echo "================================="
echo -e "${GREEN}Resource Group:${NC} $RESOURCE_GROUP"
echo -e "${GREEN}Container Registry:${NC} $ACR_NAME.azurecr.io"
echo -e "${GREEN}Database Host:${NC} $DB_SERVER_NAME.postgres.database.azure.com"
echo -e "${GREEN}Storage Account:${NC} $STORAGE_ACCOUNT"

echo -e "\n${YELLOW}🔑 SECRETS PARA CONFIGURAR NO GITHUB:${NC}"
echo "============================================"
echo -e "${BLUE}AZURE_CREDENTIALS:${NC}"
echo "$AZURE_CREDENTIALS"
echo ""
echo -e "${BLUE}AZURE_CONTAINER_REGISTRY_NAME:${NC} $ACR_NAME"
echo -e "${BLUE}ACR_PASSWORD:${NC} $ACR_PASSWORD"
echo -e "${BLUE}DB_HOST:${NC} $DB_SERVER_NAME.postgres.database.azure.com"
echo -e "${BLUE}DB_USER:${NC} $DB_ADMIN_USER"
echo -e "${BLUE}DB_PASS:${NC} $DB_PASSWORD"
echo -e "${BLUE}DB_NAME:${NC} $DB_NAME"
echo -e "${BLUE}AZURE_STORAGE_CONNECTION_STRING:${NC} $STORAGE_CONNECTION_STRING"
echo -e "${BLUE}JWT_SECRET:${NC} $JWT_SECRET"

echo -e "\n${GREEN}🎉 Setup concluído com sucesso!${NC}"
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo "1. Configure os secrets acima no GitHub (Settings → Secrets and variables → Actions)"
echo "2. Faça push do código para a branch main para disparar o pipeline"
echo "3. Monitore o deploy na aba Actions do GitHub"

echo -e "\n${YELLOW}📊 Para monitorar recursos:${NC}"
echo "az container show --name freelog-container --resource-group $RESOURCE_GROUP"
echo "az acr repository list --name $ACR_NAME"

echo -e "\n${YELLOW}🧹 Para limpar recursos (CUIDADO!):${NC}"
echo "az group delete --name $RESOURCE_GROUP --yes"
