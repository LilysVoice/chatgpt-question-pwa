variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "chatgpt-question"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the PWA"
  type        = string
  default     = "yourusername.github.io/chatgpt-question-pwa"
}

variable "lambda_api_arn" {
  description = "ARN of the Lambda API Gateway (optional)"
  type        = string
  default     = ""
}
