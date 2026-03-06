output "backend_url" {
  description = "Public URL of the backend App Service"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  description = "Public URL of the Static Web App"
  value       = "https://${azurerm_static_web_app.frontend.default_host_name}"
}

output "static_web_app_token" {
  description = "Deployment token for the Static Web App (use as GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN)"
  value       = azurerm_static_web_app.frontend.api_key
  sensitive   = true
}
