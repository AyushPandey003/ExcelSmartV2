# ─────────────────────────────────────────────────────────────────────────────
#  Data: reference the pre-existing resource group (not managed by Terraform)
# ─────────────────────────────────────────────────────────────────────────────
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# ─────────────────────────────────────────────────────────────────────────────
#  App Service Plan  (Linux / B1)
# ─────────────────────────────────────────────────────────────────────────────
resource "azurerm_service_plan" "backend_plan" {
  name                = "excelsmart-asp"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku
}

# ─────────────────────────────────────────────────────────────────────────────
#  App Service  (.NET 10 backend)
# ─────────────────────────────────────────────────────────────────────────────
resource "azurerm_linux_web_app" "backend" {
  name                = "excelsmart-api"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.backend_plan.id

  site_config {
    always_on = true

    application_stack {
      dotnet_version = "10.0"
    }

    # Health-check endpoint (Azure pings this; unhealthy instances auto-restart)
    health_check_path                 = "/swagger/index.html"
    health_check_eviction_time_in_min = 10
  }

  app_settings = {
    # Inject secrets as env-vars — never committed to source
    "Gemini__ApiKey"          = var.gemini_api_key
    "CORS_ORIGIN"             = "https://${azurerm_static_web_app.frontend.default_host_name}"
    "ASPNETCORE_ENVIRONMENT"  = "Production"

    # Optimisation: disable unnecessary file-watchers in container
    "DOTNET_USE_POLLING_FILE_WATCHER" = "false"
  }

  logs {
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
  }
}

# ─────────────────────────────────────────────────────────────────────────────
#  Static Web App  (React SPA — Free tier)
# ─────────────────────────────────────────────────────────────────────────────
resource "azurerm_static_web_app" "frontend" {
  name                = "excelsmart-web"
  location            = var.static_web_app_location
  resource_group_name = data.azurerm_resource_group.rg.name
  sku_tier            = "Free"
  sku_size            = "Free"
}
