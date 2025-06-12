terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Cognito User Pool
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

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "chatgpt_question_client" {
  name         = "${var.app_name}-client"
  user_pool_id = aws_cognito_user_pool.chatgpt_question_pool.id

  # Client settings
  generate_secret = false # Set to false for public clients (SPAs)

  # OAuth settings
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]

  # Callback URLs for your PWA
  callback_urls = [
    "https://${var.domain_name}",
    "https://${var.domain_name}/auth/callback",
    "http://localhost:5173", # For local development
    "http://localhost:5173/auth/callback"
  ]

  logout_urls = [
    "https://${var.domain_name}",
    "http://localhost:5173"
  ]

  # Supported identity providers
  supported_identity_providers = ["COGNITO"]

  # Token validity (in minutes, not hours)
  access_token_validity  = 60    # 1 hour (60 minutes)
  id_token_validity      = 60    # 1 hour (60 minutes)
  refresh_token_validity = 43200 # 30 days (30 * 24 * 60 minutes)

  # Token validity units (specify the units explicitly)
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "minutes"
  }

  # Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"

  # Enable SRP authentication
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

# Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "chatgpt_question_domain" {
  domain       = "${var.app_name}-${random_string.domain_suffix.result}"
  user_pool_id = aws_cognito_user_pool.chatgpt_question_pool.id
}

# Random string for unique domain
resource "random_string" "domain_suffix" {
  length  = 8
  special = false
  upper   = false
}

# IAM role for authenticated users
resource "aws_iam_role" "authenticated_role" {
  name = "${var.app_name}-authenticated-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.chatgpt_question_identity_pool.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

# IAM policy for authenticated users
resource "aws_iam_role_policy" "authenticated_policy" {
  name = "${var.app_name}-authenticated-policy"
  role = aws_iam_role.authenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "execute-api:Invoke"
        ]
        Resource = var.lambda_api_arn != "" ? var.lambda_api_arn : "*"
      }
    ]
  })
}

# Cognito Identity Pool
resource "aws_cognito_identity_pool" "chatgpt_question_identity_pool" {
  identity_pool_name               = "${var.app_name}-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.chatgpt_question_client.id
    provider_name           = aws_cognito_user_pool.chatgpt_question_pool.endpoint
    server_side_token_check = false
  }

  tags = {
    Name        = "${var.app_name}-identity-pool"
    Environment = var.environment
    Project     = "ChatGPT-Question"
  }
}

# Identity pool role attachment
resource "aws_cognito_identity_pool_roles_attachment" "chatgpt_question_roles" {
  identity_pool_id = aws_cognito_identity_pool.chatgpt_question_identity_pool.id

  roles = {
    "authenticated" = aws_iam_role.authenticated_role.arn
  }
}
