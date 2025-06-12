output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.chatgpt_question_pool.id
  sensitive   = false
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.chatgpt_question_client.id
  sensitive   = false
}

output "identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.chatgpt_question_identity_pool.id
  sensitive   = false
}

output "user_pool_domain" {
  description = "Domain of the Cognito User Pool"
  value       = aws_cognito_user_pool_domain.chatgpt_question_domain.domain
  sensitive   = false
}

output "cognito_domain_url" {
  description = "Full URL of the Cognito domain"
  value       = "https://${aws_cognito_user_pool_domain.chatgpt_question_domain.domain}.auth.${var.aws_region}.amazoncognito.com"
  sensitive   = false
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
  sensitive   = false
}

# Output formatted for easy copying to GitHub Secrets
output "github_secrets" {
  description = "Environment variables for GitHub Secrets"
  value = {
    VITE_COGNITO_USER_POOL_ID     = aws_cognito_user_pool.chatgpt_question_pool.id
    VITE_COGNITO_CLIENT_ID        = aws_cognito_user_pool_client.chatgpt_question_client.id
    VITE_COGNITO_IDENTITY_POOL_ID = aws_cognito_identity_pool.chatgpt_question_identity_pool.id
    VITE_AWS_REGION               = var.aws_region
  }
  sensitive = false
}
