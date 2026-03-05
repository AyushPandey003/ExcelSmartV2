output "resource_group_name" {
  description = "The name of the Resource Group"
  value       = azurerm_resource_group.rg.name
}

output "backend_app_service_name" {
  description = "The name of the Backend App Service"
  value       = azurerm_windows_web_app.backend.name
}

output "backend_url" {
  description = "The default hostname of the backend App Service"
  value       = "https://${azurerm_windows_web_app.backend.default_hostname}"
}

output "frontend_static_web_app_name" {
  description = "The name of the Frontend Static Web App"
  value       = azurerm_static_web_app.frontend.name
}

output "frontend_api_key_secret" {
  description = "The deployment token for the Static Web App"
  value       = azurerm_static_web_app.frontend.api_key
  sensitive   = true
}

output "frontend_default_hostname" {
  description = "The default hostname of the Frontend Static Web App"
  value       = azurerm_static_web_app.frontend.default_host_name
}
