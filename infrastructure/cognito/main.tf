# Cognito User Pool with custom email templates
resource "aws_cognito_user_pool" "chatgpt_question_pool" {
  name = "${var.app_name}-user-pool"

  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  # User attributes
  username_attributes = ["email"]

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Email verification
  auto_verified_attributes = ["email"]

  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # User pool add-ons
  user_pool_add_ons {
    advanced_security_mode = "ENFORCED"
  }

  # Custom email verification message with clickable link
  verification_message_template {
    default_email_option  = "CONFIRM_WITH_LINK"
    email_subject_by_link = "Verify your ChatGPT Question App account"
    email_message_by_link = "Please click the link below to verify your email address: {##Verify Email##}"
  }

  # Schema for user attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  # Deletion protection
  deletion_protection = "ACTIVE"

  tags = {
    Name        = "${var.app_name}-user-pool"
    Environment = var.environment
    Project     = "ChatGPT-Question"
  }
}

# Updated User Pool Client for link-based verification
resource "aws_cognito_user_pool_client" "chatgpt_question_client" {
  name         = "${var.app_name}-client"
  user_pool_id = aws_cognito_user_pool.chatgpt_question_pool.id

  # Client settings - no secret for public clients (SPAs)
  generate_secret = false

  # Enable SRP authentication and user password auth
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  # Callback URLs for email verification links
  callback_urls = [
    "https://${var.domain_name}/auth/verify",
    "https://${var.domain_name}",
    "http://localhost:5173/auth/verify",
    "http://localhost:5173"
  ]

  logout_urls = [
    "https://${var.domain_name}",
    "http://localhost:5173"
  ]

  # Token validity (in minutes)
  access_token_validity  = 60    # 1 hour
  id_token_validity      = 60    # 1 hour  
  refresh_token_validity = 43200 # 30 days

  # Token validity units
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "minutes"
  }

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  # Support OAuth for link-based verification
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  supported_identity_providers         = ["COGNITO"]
}
