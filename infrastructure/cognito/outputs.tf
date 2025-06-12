output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.chatgpt_question_pool.id
}

output "user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.chatgpt_question_client.id
}

output "identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.chatgpt_question_identity_pool.id
}

output "user_pool_domain" {
  description = "Domain of the Cognito User Pool"
  value       = aws_cognito_user_pool_domain.chatgpt_question_domain.domain
}

output "cognito_domain_url" {
  description = "Full URL of the Cognito domain"
  value       = "https://${aws_cognito_user_pool_domain.chatgpt_question_domain.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}
