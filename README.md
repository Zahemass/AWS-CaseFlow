# 🚀 CaseFlow AI - Complete Setup Guide

## 🎯 Project Overview

CaseFlow AI revolutionizes legal case management by combining AWS serverless architecture with Amazon Bedrock's powerful AI capabilities. Our platform enables law firms to efficiently manage cases, analyze documents, and gain intelligent insights through conversational AI.

---

## 📋 Prerequisites

### Required Tools
- **Node.js** v18+ and npm
- **AWS Account** with admin access
- **AWS CLI** configured with credentials
- **Git** for version control

### AWS Services Required
- Amazon Cognito (Authentication)
- Amazon S3 (Document Storage)
- Amazon DynamoDB (Database)
- Amazon Bedrock (AI Agents) + RAG
- AWS Lambda (Serverless Functions)
- API Gateway (REST API)
- AWS Amplify (Frontend Hosting)
- AWS CloudWatch (for logs)
- AWS SES (Triggring Mail) 

---

## 🛠️ Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Zahemass/caseflow-ai.git
cd caseflow-ai

# Install dependencies
npm install
```

### 2. Environment Configuration

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your AWS configuration:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_AWS_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# S3 Configuration
VITE_AWS_S3_BUCKET=caseflow-documents-bucket
VITE_AWS_S3_REGION=us-east-1

# API Configuration  
VITE_API_GATEWAY_URL=https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod

# Bedrock Configuration
VITE_BEDROCK_AGENT_ID=XXXXXXXXXX
VITE_BEDROCK_AGENT_ALIAS_ID=XXXXXXXXXX
VITE_BEDROCK_KNOWLEDGE_BASE_ID=XXXXXXXXXX

# DynamoDB Tables
VITE_DYNAMODB_DOCUMENTS_TABLE=caseflow-documents
VITE_DYNAMODB_CASES_TABLE=caseflow-cases
VITE_DYNAMODB_ANALYSIS_TABLE=caseflow-analysis
VITE_DYNAMODB_EXTRACTED_TABLE=casflow-pdf-extracted


# AWS Credentials for Local Development
VITE_AWS_S3_PDF_BUCKET=trigger-the-pdf
VITE_AWS_ACCESS_KEY_ID=xxxxxxxxxxx
VITE_AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
---


```

AWS Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add authentication
amplify add auth

# Add API
amplify add api
# Select: REST
# Follow prompts to create Lambda functions

# Add storage
amplify add storage

# Deploy everything
amplify push
```



### Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

---

## 📄 License

MIT License - see LICENSE file for details


---

**Built with ❤️ using React, AWS, and AI**

