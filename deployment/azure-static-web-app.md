# Deploy to Azure Static Web App

## Requirements
- Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
- GitHub repo

## Step 1: Build the project
```bash
npm run build
```

## Step 2: Login to Azure
```bash
az login
```

## Step 3: Create the static web app
```bash
az staticwebapp create   --name my-vue-app   --resource-group my-resource-group   --source .   --location "West Europe"   --app-location "."   --output-location "dist"
```

## Step 4: GitHub Action will auto-deploy after pushing to main branch.