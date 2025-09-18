# 🚀 Deploy Azure - Guia Rápido

## ⚡ Setup Automático (Recomendado)

### 1. Execute o script de setup:
```bash
./scripts/azure-setup.sh
```

### 2. Configure os secrets no GitHub:
- Vá em **Settings → Secrets and variables → Actions**
- Adicione cada secret mostrado pelo script

### 3. Faça push para main:
```bash
git add .
git commit -m "feat: add Azure deploy pipeline"
git push origin main
```

## 📋 Secrets Necessários

| Secret | Descrição |
|--------|-----------|
| `AZURE_CREDENTIALS` | Credenciais do Service Principal |
| `ACR_PASSWORD` | Senha do Container Registry |
| `DB_HOST` | Host do PostgreSQL |
| `DB_USER` | Usuário do banco |
| `DB_PASS` | Senha do banco |
| `DB_NAME` | Nome do database |
| `AZURE_STORAGE_CONNECTION_STRING` | Connection string do Storage |
| `JWT_SECRET` | Chave secreta JWT |

## 🔍 Monitoramento

### Ver status do container:
```bash
az container show --name freelog-container --resource-group freelog-rg
```

### Ver logs:
```bash
az container logs --name freelog-container --resource-group freelog-rg
```

### Obter URL da aplicação:
```bash
az container show --name freelog-container --resource-group freelog-rg --query ipAddress.ip --output tsv
```

## 🆘 Troubleshooting

### Container não inicia:
1. Verifique os logs: `az container logs --name freelog-container --resource-group freelog-rg`
2. Verifique os secrets no GitHub
3. Verifique se o banco está acessível

### Aplicação não responde:
1. Teste o health check: `curl http://<IP>:8080/health`
2. Verifique se a porta 8080 está exposta
3. Aguarde alguns minutos para inicialização

### Pipeline falha:
1. Verifique se todos os secrets estão configurados
2. Verifique se o Service Principal tem permissões
3. Verifique logs na aba Actions do GitHub

## 🧹 Limpeza

Para deletar todos os recursos:
```bash
az group delete --name freelog-rg --yes
```
