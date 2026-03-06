variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "resource_group_name" {
  description = "Pre-existing resource group name"
  type        = string
  default     = "citizenbridge-rg"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "centralindia"
}

variable "gemini_api_key" {
  description = "Google Gemini API key (injected as App Service app-setting)"
  type        = string
  sensitive   = true
}

variable "static_web_app_location" {
  description = "Region for Static Web App (limited availability: westus2, centralus, eastus2, westeurope, eastasia)"
  type        = string
  default     = "eastasia"
}

variable "app_service_plan_sku" {
  description = "App Service Plan SKU name"
  type        = string
  default     = "B1"
}
