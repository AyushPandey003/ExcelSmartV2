# Terraform Azure Deployment

This directory contains the Infrastructure as Code (IaC) configuration to deploy ExcelSmart v2 to Azure.

## Resources Provisioned
- **Resource Group**: Logical container for all resources.
- **Azure App Service Plan & Web App**: Windows-based App Service running .NET 8 for the backend API.
- **Azure Static Web App**: Frontend hosting for the React/Vite application.

## GitHub Actions Integration
The deployment is fully automated via GitHub Actions.

### Required GitHub Secrets
To make the deployment work, you **must** add the following secrets to your GitHub Repository (`Settings > Secrets and variables > Actions > New repository secret`):

#### 1. Azure Authentication (for Terraform & Backend)
You need to create an Azure Service Principal and add its credentials:
- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

*Note: For maximum security, configure your App Registration in Azure to use Federated Credentials (OIDC). Since the workflow uses a GitHub Environment named `production`, you should add a credential for **Entity type: Environment** with the name `production`.*

#### 2. Static Web App Token (for Frontend)
After Terraform runs the first time, it will output the API Key for the Static Web App. You must copy that value and add it as a secret:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Workflow Order
1. **Terraform**: Runs on pushes to `terraform/**`. It provisions the infrastructure.
2. **Deploy Backend**: Runs on pushes to `backend/**`. It builds and deploys the .NET API.
3. **Deploy Frontend**: Runs on pushes to `frontend/**`. It builds and deploys the React app. **(Requires Terraform to run first to configure the base URL)**.
