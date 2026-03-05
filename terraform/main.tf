terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # For GitHub Actions CI/CD to hold state, Azure Storage should typically be used.
  # We assume local state here for simplicity but it should be moved to a remote backend.
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "tfstate"
  #   container_name       = "tfstate"
  #   key                  = "terraform.tfstate"
  # }
}

provider "azurerm" {
  features {}
  use_oidc = true
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
}

# --------------------------------------------------------------------------------
# Backend: Azure App Service (Windows) for ASP.NET Core 8
# --------------------------------------------------------------------------------

resource "azurerm_service_plan" "app_plan" {
  name                = "asp-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Windows"
  sku_name            = "F1" # Free tier. Change to B1 or higher for production.
}

resource "azurerm_windows_web_app" "backend" {
  name                = "app-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.app_plan.id

  site_config {
    always_on = false # F1 does not support always_on
    
    application_stack {
      current_stack  = "dotnet"
      dotnet_version = "v10.0"
    }

    cors {
      allowed_origins     = ["https://${azurerm_static_web_app.frontend.default_host_name}"]
      support_credentials = true
    }
  }

  app_settings = {
    "ASPNETCORE_ENVIRONMENT" = "Production"
    "FrontendUrl"            = "https://${azurerm_static_web_app.frontend.default_host_name}"
    "Gemini__ApiKey"         = var.gemini_api_key  # Use double underscore for nested JSON config
  }
}

# --------------------------------------------------------------------------------
# Frontend: Azure Static Web App for React/Vite
# --------------------------------------------------------------------------------

resource "azurerm_static_web_app" "frontend" {
  name                = "stapp-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "eastus2" # Static Web Apps have specific supported regions
  sku_tier            = "Free"    # Free tier for Static Web Apps
  sku_size            = "Free"
}

# Note: The deployment token will be exported via outputs.tf so GitHub Actions can use it.
