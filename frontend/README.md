# 🚀 CaseFlow AI - Complete Setup Guide

## Overview
CaseFlow AI is a serverless legal case management system built with React and AWS services, featuring AI-powered document analysis, contradiction detection, credibility analysis, and timeline generation.

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
- Amazon Textract (Document Processing)
- Amazon Comprehend (NLP)
- Amazon Bedrock (AI Agents)
- AWS Lambda (Serverless Functions)
- API Gateway (REST API)
- AWS Amplify (Frontend Hosting)

---

## 🛠️ Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/caseflow-ai.git
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
```

---

## 🏗️ AWS Infrastructure Setup

### Option 1: AWS CDK (Recommended)

Create infrastructure using AWS CDK:

```bash
# Install AWS CDK globally
npm install -g aws-cdk

# Navigate to infrastructure directory
cd infrastructure

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy all stacks
cdk deploy --all
```

The CDK will create:
- Cognito User Pool and Identity Pool
- S3 Buckets with CORS configuration
- DynamoDB Tables with indexes
- Lambda Functions for API endpoints
- API Gateway REST API
- IAM Roles and Policies
- Bedrock Agent configurations

### Option 2: AWS Amplify CLI

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

---

## 🔧 Lambda Functions Setup

Create the following Lambda functions in AWS Console or via CDK:

### 1. Get Upload URL
**Path**: `lambda-functions/get-upload-url/index.mjs`

```javascript
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const s3 = new S3Client({});
const dynamo = new DynamoDBClient({});

export const handler = async (event) => {
  const { fileName, caseId, contentType } = JSON.parse(event.body);
  const documentId = `${caseId}-${Date.now()}`;
  const key = `cases/${caseId}/documents/${documentId}`;
  
  // Generate pre-signed URL
  const command = new PutObjectCommand({
    Bucket: process.env.DOCUMENTS_BUCKET,
    Key: key,
    ContentType: contentType
  });
  
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  
  // Store metadata
  await dynamo.send(new PutItemCommand({
    TableName: process.env.DOCUMENTS_TABLE,
    Item: {
      documentId: { S: documentId },
      caseId: { S: caseId },
      fileName: { S: fileName },
      status: { S: 'UPLOADING' },
      createdAt: { N: Date.now().toString() }
    }
  }));
  
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ uploadUrl, documentId, key })
  };
};
```

### 2. Process Document (S3 Trigger)
**Path**: `lambda-functions/process-document/index.mjs`

```javascript
import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from '@aws-sdk/client-textract';
import { ComprehendClient, DetectEntitiesCommand } from '@aws-sdk/client-comprehend';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const textract = new TextractClient({});
const comprehend = new ComprehendClient({});
const dynamo = new DynamoDBClient({});

export const handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  
  // Extract document ID from key
  const documentId = key.split('/').pop();
  
  // Start Textract job
  const textractJob = await textract.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: { S3Object: { Bucket: bucket, Name: key } }
    })
  );
  
  // Wait for completion (in production, use Step Functions)
  let result;
  do {
    await new Promise(resolve => setTimeout(resolve, 5000));
    result = await textract.send(
      new GetDocumentTextDetectionCommand({ JobId: textractJob.JobId })
    );
  } while (result.JobStatus === 'IN_PROGRESS');
  
  // Extract text
  const text = result.Blocks
    .filter(b => b.BlockType === 'LINE')
    .map(b => b.Text)
    .join('\n');
  
  // Extract entities
  const entities = await comprehend.send(
    new DetectEntitiesCommand({
      Text: text.slice(0, 5000),
      LanguageCode: 'en'
    })
  );
  
  // Update DynamoDB
  await dynamo.send(new UpdateItemCommand({
    TableName: process.env.DOCUMENTS_TABLE,
    Key: { documentId: { S: documentId } },
    UpdateExpression: 'SET #status = :status, extractedText = :text, entities = :entities',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': { S: 'PROCESSED' },
      ':text': { S: text },
      ':entities': { S: JSON.stringify(entities.Entities) }
    }
  }));
  
  return { statusCode: 200 };
};
```

### 3. Invoke Agent
**Path**: `lambda-functions/invoke-agent/index.mjs`

```javascript
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';

const bedrock = new BedrockAgentRuntimeClient({});

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  const { question, caseId, sessionId } = JSON.parse(event.body);
  
  const command = new InvokeAgentCommand({
    agentId: process.env.AGENT_ID,
    agentAliasId: process.env.AGENT_ALIAS_ID,
    sessionId: sessionId,
    inputText: question,
    sessionState: {
      sessionAttributes: { caseId }
    }
  });
  
  const response = await bedrock.send(command);
  
  for await (const chunk of response.completion) {
    if (chunk.chunk?.bytes) {
      responseStream.write(chunk.chunk.bytes);
    }
  }
  
  responseStream.end();
});
```

### 4. Detect Contradictions
**Path**: `lambda-functions/detect-contradictions/index.mjs`

```javascript
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const bedrock = new BedrockAgentRuntimeClient({});
const dynamo = new DynamoDBClient({});

export const handler = async (event) => {
  const { caseId } = JSON.parse(event.body);
  
  // Get all documents for the case
  const documents = await dynamo.send(new QueryCommand({
    TableName: process.env.DOCUMENTS_TABLE,
    IndexName: 'CaseIdIndex',
    KeyConditionExpression: 'caseId = :caseId',
    ExpressionAttributeValues: {
      ':caseId': { S: caseId }
    }
  }));
  
  // Use Bedrock Agent to detect contradictions
  const prompt = `Analyze these documents for contradictions: ${JSON.stringify(documents.Items)}`;
  
  const response = await bedrock.send(new InvokeAgentCommand({
    agentId: process.env.CONTRADICTION_AGENT_ID,
    agentAliasId: process.env.AGENT_ALIAS_ID,
    sessionId: `contradiction-${Date.now()}`,
    inputText: prompt
  }));
  
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ contradictions: response.output })
  };
};
```

---

## 🎨 Frontend Development

### Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🚀 Deployment

### Option 1: AWS Amplify (Easiest)

```bash
# Connect to GitHub repository
amplify add hosting

# Select: Amplify Console
# Follow prompts to connect GitHub

# Deploy
amplify publish
```

Amplify provides:
- Automatic CI/CD from GitHub
- Global CDN via CloudFront
- Free SSL certificates
- Preview environments for PRs
- Rollback capabilities

### Option 2: Manual Deployment to S3 + CloudFront

```bash
# Build the project
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linter
npm run lint
```

---

## 📚 Project Structure

```
caseflow-ai/
├── src/
│   ├── components/         # React components
│   │   ├── Common/         # Reusable components
│   │   ├── Layout/         # Layout components
│   │   ├── Auth/           # Authentication
│   │   ├── Documents/      # Document management
│   │   ├── Agent/          # AI agent chat
│   │   └── Analysis/       # Analysis tools
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   ├── context/            # React contexts
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration
│   └── constants/          # Constants
├── lambda-functions/       # Lambda function code
├── infrastructure/         # CDK infrastructure
└── public/                 # Static assets
```

---

## 🔑 Key Features

### ✅ Implemented
- User authentication (Cognito)
- Document upload to S3
- Document processing (Textract)
- Case management
- AI agent chat
- Responsive UI with Tailwind

### 🚧 To Be Completed
- Contradiction detection UI
- Timeline builder visualization
- Credibility analyzer
- Evidence chain graph
- Real-time notifications
- Advanced search

---

## 🐛 Troubleshooting

### CORS Issues
Add CORS configuration to API Gateway and S3 bucket:

```json
{
  "CorsConfiguration": {
    "CorsRules": [{
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }
}
```

### Authentication Errors
1. Verify Cognito User Pool ID and Client ID
2. Check Identity Pool role permissions
3. Ensure JWT tokens are being stored correctly

### Upload Failures
1. Check S3 bucket permissions
2. Verify pre-signed URL expiration
3. Check file size limits

---

## 📖 Additional Resources

- [AWS Amplify Docs](https://docs.amplify.aws/)
- [AWS CDK Guide](https://docs.aws.amazon.com/cdk/)
- [Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 💡 Next Steps

1. **Complete AWS Setup**: Configure all required AWS services
2. **Deploy Lambda Functions**: Upload and configure all Lambda functions
3. **Test Authentication**: Verify Cognito integration works
4. **Upload Test Documents**: Test document upload and processing
5. **Configure Bedrock Agents**: Set up AI agents for analysis
6. **Build Remaining Components**: Complete UI components
7. **Deploy to Amplify**: Push to production
8. **Test End-to-End**: Full system testing

---

## 📞 Support

For issues or questions:
- Open a GitHub Issue
- Email: support@caseflow-ai.com
- Documentation: docs.caseflow-ai.com

---

**Built with ❤️ using React, AWS, and AI**




caseflow-ai-frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   │
│   ├── assets/                          # Static assets
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── empty-state.svg
│   │   │   ├── upload-icon.svg
│   │   │   ├── no-documents.svg
│   │   │   └── error-illustration.svg
│   │   │
│   │   └── fonts/                       # Custom fonts (if any)
│   │       └── Roboto/
│   │
│   ├── components/                      # Reusable components
│   │   │
│   │   ├── Layout/                      # Layout components
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   │
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Sidebar.css
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.css
│   │   │   │
│   │   │   └── MainLayout/
│   │   │       ├── MainLayout.jsx
│   │   │       └── MainLayout.css
│   │   │
│   │   ├── Auth/                        # Authentication components
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── LoginForm.css
│   │   │   │
│   │   │   ├── RegisterForm/
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── RegisterForm.css
│   │   │   │
│   │   │   └── ProtectedRoute/
│   │   │       └── ProtectedRoute.jsx
│   │   │
│   │   ├── Cases/                       # Case management components
│   │   │   ├── CaseList/
│   │   │   │   ├── CaseList.jsx
│   │   │   │   ├── CaseList.css
│   │   │   │   └── CaseCard.jsx
│   │   │   │
│   │   │   ├── CaseDetails/
│   │   │   │   ├── CaseDetails.jsx
│   │   │   │   └── CaseDetails.css
│   │   │   │
│   │   │   ├── CreateCase/
│   │   │   │   ├── CreateCaseModal.jsx
│   │   │   │   └── CreateCaseModal.css
│   │   │   │
│   │   │   └── CaseStats/
│   │   │       ├── CaseStats.jsx
│   │   │       └── CaseStats.css
│   │   │
│   │   ├── Documents/                   # Document components
│   │   │   ├── DocumentUploader/
│   │   │   │   ├── DocumentUploader.jsx
│   │   │   │   ├── DocumentUploader.css
│   │   │   │   └── UploadProgress.jsx
│   │   │   │
│   │   │   ├── DocumentList/
│   │   │   │   ├── DocumentList.jsx
│   │   │   │   ├── DocumentList.css
│   │   │   │   ├── DocumentCard.jsx
│   │   │   │   └── DocumentFilter.jsx
│   │   │   │
│   │   │   ├── DocumentViewer/
│   │   │   │   ├── DocumentViewer.jsx
│   │   │   │   ├── DocumentViewer.css
│   │   │   │   └── PDFViewer.jsx
│   │   │   │
│   │   │   └── DocumentMetadata/
│   │   │       ├── DocumentMetadata.jsx
│   │   │       └── DocumentMetadata.css
│   │   │
│   │   ├── Agent/                       # AI Agent components
│   │   │   ├── AgentChat/
│   │   │   │   ├── AgentChat.jsx
│   │   │   │   ├── AgentChat.css
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   │
│   │   │   ├── AgentSelector/
│   │   │   │   ├── AgentSelector.jsx
│   │   │   │   └── AgentSelector.css
│   │   │   │
│   │   │   └── AgentResponse/
│   │   │       ├── AgentResponse.jsx
│   │   │       ├── AgentResponse.css
│   │   │       └── CitationPopover.jsx
│   │   │
│   │   ├── Analysis/                    # Analysis & visualization components
│   │   │   ├── ContradictionDetector/
│   │   │   │   ├── ContradictionDetector.jsx
│   │   │   │   ├── ContradictionDetector.css
│   │   │   │   ├── ContradictionCard.jsx
│   │   │   │   └── ContradictionComparison.jsx
│   │   │   │
│   │   │   ├── TimelineBuilder/
│   │   │   │   ├── TimelineBuilder.jsx
│   │   │   │   ├── TimelineBuilder.css
│   │   │   │   ├── TimelineEvent.jsx
│   │   │   │   └── TimelineControls.jsx
│   │   │   │
│   │   │   ├── CredibilityAnalyzer/
│   │   │   │   ├── CredibilityAnalyzer.jsx
│   │   │   │   ├── CredibilityAnalyzer.css
│   │   │   │   ├── CredibilityScore.jsx
│   │   │   │   ├── ClaimVerification.jsx
│   │   │   │   └── CredibilityChart.jsx
│   │   │   │
│   │   │   └── EvidenceChain/
│   │   │       ├── EvidenceChain.jsx
│   │   │       ├── EvidenceChain.css
│   │   │       ├── EvidenceGraph.jsx
│   │   │       └── EvidenceNode.jsx
│   │   │
│   │   ├── Dashboard/                   # Dashboard components
│   │   │   ├── DashboardStats/
│   │   │   │   ├── DashboardStats.jsx
│   │   │   │   ├── DashboardStats.css
│   │   │   │   └── StatCard.jsx
│   │   │   │
│   │   │   ├── RecentActivity/
│   │   │   │   ├── RecentActivity.jsx
│   │   │   │   └── RecentActivity.css
│   │   │   │
│   │   │   └── QuickActions/
│   │   │       ├── QuickActions.jsx
│   │   │       └── QuickActions.css
│   │   │
│   │   ├── Common/                      # Common/shared components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   │
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Card.css
│   │   │   │
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Modal.css
│   │   │   │
│   │   │   ├── Spinner/
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── Spinner.css
│   │   │   │
│   │   │   ├── Toast/
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Toast.css
│   │   │   │   └── ToastContainer.jsx
│   │   │   │
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.jsx
│   │   │   │   └── Badge.css
│   │   │   │
│   │   │   ├── Skeleton/
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── Skeleton.css
│   │   │   │
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── EmptyState.css
│   │   │   │
│   │   │   ├── ErrorBoundary/
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   │
│   │   │   └── ConfirmDialog/
│   │   │       ├── ConfirmDialog.jsx
│   │   │       └── ConfirmDialog.css
│   │   │
│   │   └── index.js                     # Export all components
│   │
│   ├── pages/                           # Page components (route-level)
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.css
│   │   │   ├── RegisterPage.jsx
│   │   │   └── RegisterPage.css
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DashboardPage.css
│   │   │
│   │   ├── Cases/
│   │   │   ├── CasesPage.jsx
│   │   │   ├── CasesPage.css
│   │   │   ├── CaseDetailPage.jsx
│   │   │   └── CaseDetailPage.css
│   │   │
│   │   ├── Documents/
│   │   │   ├── DocumentsPage.jsx
│   │   │   └── DocumentsPage.css
│   │   │
│   │   ├── Analysis/
│   │   │   ├── AnalysisPage.jsx
│   │   │   └── AnalysisPage.css
│   │   │
│   │   ├── NotFound/
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── NotFoundPage.css
│   │   │
│   │   └── index.js                     # Export all pages
│   │
│   ├── services/                        # API and service layer
│   │   ├── api/
│   │   │   ├── apiClient.js             # Axios/Fetch configuration
│   │   │   ├── endpoints.js             # API endpoints constants
│   │   │   └── interceptors.js          # Request/response interceptors
│   │   │
│   │   ├── auth/
│   │   │   ├── authService.js           # Cognito authentication
│   │   │   ├── tokenManager.js          # JWT token management
│   │   │   └── cognitoConfig.js         # Cognito configuration
│   │   │
│   │   ├── cases/
│   │   │   ├── caseService.js           # Case CRUD operations
│   │   │   └── caseApi.js               # Case API calls
│   │   │
│   │   ├── documents/
│   │   │   ├── documentService.js       # Document operations
│   │   │   ├── uploadService.js         # S3 upload logic
│   │   │   └── documentApi.js           # Document API calls
│   │   │
│   │   ├── agent/
│   │   │   ├── agentService.js          # Bedrock agent invocation
│   │   │   ├── streamHandler.js         # Streaming response handler
│   │   │   └── agentApi.js              # Agent API calls
│   │   │
│   │   ├── analysis/
│   │   │   ├── contradictionService.js  # Contradiction detection
│   │   │   ├── timelineService.js       # Timeline generation
│   │   │   ├── credibilityService.js    # Credibility analysis
│   │   │   └── evidenceService.js       # Evidence chain
│   │   │
│   │   └── websocket/
│   │       ├── websocketService.js      # WebSocket connection (if needed)
│   │       └── messageHandler.js        # Message handling
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAuth.js                   # Authentication hook
│   │   ├── useCases.js                  # Cases data hook
│   │   ├── useDocuments.js              # Documents hook
│   │   ├── useAgent.js                  # Agent interaction hook
│   │   ├── useUpload.js                 # File upload hook
│   │   ├── useDebounce.js               # Debounce hook
│   │   ├── useLocalStorage.js           # Local storage hook
│   │   ├── useToast.js                  # Toast notifications hook
│   │   ├── useWebSocket.js              # WebSocket hook
│   │   └── usePagination.js             # Pagination hook
│   │
│   ├── context/                         # React Context providers
│   │   ├── AuthContext.js               # Auth context & provider
│   │   ├── CaseContext.js               # Current case context
│   │   ├── ThemeContext.js              # Theme context (if needed)
│   │   └── ToastContext.js              # Toast notifications context
│   │
│   ├── store/                           # State management (if using Redux/Zustand)
│   │   ├── slices/                      # Redux slices (if Redux)
│   │   │   ├── authSlice.js
│   │   │   ├── casesSlice.js
│   │   │   ├── documentsSlice.js
│   │   │   └── agentSlice.js
│   │   │
│   │   ├── store.js                     # Redux store configuration
│   │   └── index.js
│   │
│   ├── utils/                           # Utility functions
│   │   ├── formatters.js                # Date, number formatters
│   │   ├── validators.js                # Form validation
│   │   ├── constants.js                 # App constants
│   │   ├── helpers.js                   # Helper functions
│   │   ├── errorHandler.js              # Error handling utilities
│   │   ├── fileUtils.js                 # File manipulation utilities
│   │   └── chartHelpers.js              # Chart data transformation
│   │
│   ├── styles/                          # Global styles
│   │   ├── global.css                   # Global CSS
│   │   ├── variables.css                # CSS variables (colors, spacing)
│   │   ├── reset.css                    # CSS reset
│   │   ├── typography.css               # Typography styles
│   │   ├── animations.css               # Keyframe animations
│   │   └── responsive.css               # Media queries
│   │
│   ├── config/                          # Configuration files
│   │   ├── aws.config.js                # AWS SDK configuration
│   │   ├── app.config.js                # App configuration
│   │   └── routes.config.js             # Route configuration
│   │
│   ├── constants/                       # Constants
│   │   ├── apiConstants.js              # API-related constants
│   │   ├── appConstants.js              # App constants
│   │   ├── routeConstants.js            # Route paths
│   │   └── statusConstants.js           # Status codes, types
│   │
│   ├── routes/                          # Routing configuration
│   │   ├── AppRoutes.jsx                # Main routing component
│   │   ├── privateRoutes.js             # Private route definitions
│   │   └── publicRoutes.js              # Public route definitions
│   │
│   ├── App.jsx                          # Main App component
│   ├── App.css                          # App-level styles
│   ├── index.js                         # Entry point
│   └── index.css                        # Root styles
│
├── .env                                 # Environment variables (local)
├── .env.example                         # Example environment variables
├── .gitignore                           # Git ignore file
├── package.json                         # Dependencies
├── package-lock.json                    # Lock file
├── README.md                            # Project documentation
└── vite.config.js                       # Vite configuration (or CRA config)