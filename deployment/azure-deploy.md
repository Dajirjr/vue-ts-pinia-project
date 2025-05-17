# Deploy to Azure

## Prerequisites
- Node.js 18 or later
- npm or yarn
- Azure account
- Azure CLI
- Git repository
- Visual Studio Code with Azure Tools extension (optional)

## Step 1: Install Azure CLI
### Windows
```powershell
winget install -e --id Microsoft.AzureCLI
```

### macOS
```bash
brew install azure-cli
```

### Linux
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

## Step 2: Prepare Your Project
1. Ensure your `package.json` has the correct scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "start": "node server.js"
  }
}
```

2. Create a simple Express server (`server.js`):
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

3. Add Express dependency:
```bash
npm install express
```

## Step 3: Azure Setup

### Option 1: Using Azure CLI
1. Login to Azure:
```bash
az login
```

2. Create a resource group:
```bash
az group create --name myapp-rg --location eastus
```

3. Create an App Service plan:
```bash
az appservice plan create --name myapp-plan --resource-group myapp-rg --sku B1 --is-linux
```

4. Create a web app:
```bash
az webapp create --name myapp --resource-group myapp-rg --plan myapp-plan --runtime "NODE|18-lts"
```

### Option 2: Using Azure Portal
1. Log in to [Azure Portal](https://portal.azure.com)
2. Create a new Web App
3. Configure:
   - Runtime stack: Node.js 18 LTS
   - Operating System: Linux
   - Region: Choose nearest
   - App Service Plan: Select or create new

## Step 4: Configure Deployment

### Using GitHub Actions
1. Add Azure deployment credentials:
```bash
az ad sp create-for-rbac --name "myapp" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
  --sdk-auth
```

2. Add GitHub Secrets:
   - AZURE_CREDENTIALS
   - AZURE_WEBAPP_NAME

3. Create `.github/workflows/azure-deploy.yml`:
```yaml
name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
        
    - name: Build
      run: npm run build
        
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

## Step 5: Configure Environment Variables
1. In Azure Portal:
   - Go to your Web App
   - Configuration → Application settings
   - Add new application setting:
```
VITE_API_URL=https://api.example.com
```

## Step 6: Set Up Custom Domain (Optional)
1. In Azure Portal:
   - Go to your Web App
   - Custom domains
   - Add custom domain
   - Follow DNS configuration steps

## Monitoring and Diagnostics
1. Application Insights
```javascript
// Add to your app
const appInsights = require('applicationinsights');
appInsights.setup('YOUR_INSTRUMENTATION_KEY').start();
```

2. Enable logging:
```bash
az webapp log config --name myapp --resource-group myapp-rg --web-server-logging filesystem
```

3. View logs:
```bash
az webapp log tail --name myapp --resource-group myapp-rg
```

## Scaling and Performance
1. Configure auto-scaling:
```bash
az monitor autoscale create --resource-group myapp-rg --name myapp-autoscale \
  --resource myapp --min-count 1 --max-count 5 --count 1
```

2. Enable CDN:
   - Azure Portal → Your Web App
   - Networking → Azure CDN
   - Configure CDN endpoint

## Troubleshooting
Common issues and solutions:

1. Deployment Failures
   - Check deployment logs
   - Verify build configuration
   - Check Node.js version

2. Runtime Issues
   - Check Application Insights
   - Review server logs
   - Monitor performance metrics

3. Networking Issues
   - Verify CORS settings
   - Check SSL/TLS configuration
   - Review network security rules

## Best Practices
1. Use deployment slots for zero-downtime updates
2. Enable application insights
3. Configure proper logging
4. Set up alerts and monitoring
5. Use Azure Key Vault for secrets

## Additional Features
- Azure CDN
- Azure Key Vault
- Application Insights
- Auto-scaling
- Deployment slots
- Backup and restore
- SSL certificates 