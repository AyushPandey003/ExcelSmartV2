variable "location" {
  description = "The Azure region to deploy resources to"
  type        = string
  default     = "eastus"
}

variable "project_name" {
  description = "The base name for the resources"
  type        = string
  default     = "excelsmartv2"
}

variable "environment" {
  description = "The environment name (e.g. dev, prod)"
  type        = string
  default     = "prod"
}

variable "gemini_api_key" {
  description = "The AI API Key to use for the application"
  type        = string
  sensitive   = true
}
