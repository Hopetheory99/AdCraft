# AdCraft Technical Architecture

This document outlines the technical architecture of the AdCraft platform, including system components, data flows, infrastructure design, and integration points.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               CLIENT LAYER                                   │
│                                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  Web Client  │   │ Mobile - iOS │   │Mobile-Android│   │  Admin Panel │  │
│  │   (React)    │   │(React Native)│   │(React Native)│   │    (React)   │  │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘  │
└────────┬─────────────────┬──────────────────┬──────────────────┬────────────┘
         │                 │                  │                  │
         │                 │                  │                  │
         ▼                 ▼                  ▼                  ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                    │
│                                                                            │
│   ┌─────────────────┐  ┌───────────────┐  ┌────────────┐  ┌────────────┐   │
│   │  Authentication │  │   Rate        │  │  Request   │  │  Response  │   │
│   │  & Authorization│  │   Limiting    │  │  Routing   │  │  Caching   │   │
│   └─────────────────┘  └───────────────┘  └────────────┘  └────────────┘   │
└──────────────┬─────────────────────────────────┬────────────────────────────┘
               │                                 │
               ▼                                 ▼
┌──────────────────────────────────────────┐   ┌───────────────────────────┐
│            MICROSERVICES LAYER           │   │      SHARED SERVICES      │
│                                          │   │                           │
│  ┌──────────────┐   ┌──────────────┐     │   │  ┌─────────────────────┐ │
│  │     Auth     │   │    Asset     │     │   │  │   Logging Service   │ │
│  │   Service    │◄─►│   Service    │     │   │  └─────────────────────┘ │
│  └──────────────┘   └──────────────┘     │   │  ┌─────────────────────┐ │
│                                          │   │  │ Monitoring Service  │ │
│  ┌──────────────┐   ┌──────────────┐     │   │  └─────────────────────┘ │
│  │  Template    │   │ Ad Creation  │     │   │  ┌─────────────────────┐ │
│  │   Service    │◄─►│   Service    │     │   │  │    Event Service    │ │
│  └──────────────┘   └──────────────┘     │   │  └─────────────────────┘ │
│                                          │   │  ┌─────────────────────┐ │
│  ┌──────────────┐   ┌──────────────┐     │   │  │   Config Service    │ │
│  │  Publishing  │   │  Analytics   │     │   │  └─────────────────────┘ │
│  │   Service    │◄─►│   Service    │     │   │                           │
│  └──────────────┘   └──────────────┘     │   └───────────────────────────┘
└───────────┬───────────────┬──────────────┘
            │               │
            ▼               ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│  Document Store   │   │  Relational DB    │   │   Cache Layer     │
│     (MongoDB)     │   │   (PostgreSQL)    │   │     (Redis)       │
└───────────────────┘   └───────────────────┘   └───────────────────┘
            ▲               ▲                           ▲
            │               │                           │
            └───────────────┼───────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLOUD SERVICES                                  │
│                                                                         │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐      │
│  │    S3      │   │ CloudFront │   │CloudWatch  │   │   ECS/EKS  │      │
│  │  Storage   │   │    CDN     │   │ Monitoring │   │ Containers │      │
│  └────────────┘   └────────────┘   └────────────┘   └────────────┘      │
│                                                                         │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐      │
│  │  Cognito   │   │    SQS     │   │     SNS    │   │ Parameter  │      │
│  │(Auth Backup)│   │   Queue    │   │   Pub/Sub  │   │   Store    │      │
│  └────────────┘   └────────────┘   └────────────┘   └────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Microservices Architecture Detail

### Authentication Service

**Responsibility**: Manages user authentication, registration, and authorization.

**Key Components**:
- User management
- JWT token generation and validation
- Role-based access control
- Social login integration
- Password recovery

**Database**: MongoDB (user profiles, credentials, roles)

**APIs**:
- POST /auth/register - Register new user
- POST /auth/login - Authenticate user
- POST /auth/refresh - Refresh access token
- GET /auth/profile - Get user profile
- PUT /auth/profile - Update user profile

### Asset Service

**Responsibility**: Handles asset upload, storage, and management.

**Key Components**:
- File upload processing
- Image optimization
- Asset metadata management
- Asset categorization
- S3 integration

**Database**: MongoDB (asset metadata), S3 (asset storage)

**APIs**:
- POST /assets - Upload new asset
- GET /assets - List assets
- GET /assets/:id - Get asset details
- PUT /assets/:id - Update asset metadata
- DELETE /assets/:id - Delete asset

### Template Service

**Responsibility**: Manages ad templates and template categories.

**Key Components**:
- Template CRUD operations
- Template categorization
- Template search and filtering
- Template versioning

**Database**: MongoDB (templates, categories)

**APIs**:
- POST /templates - Create template
- GET /templates - List templates
- GET /templates/:id - Get template details
- PUT /templates/:id - Update template
- DELETE /templates/:id - Delete template
- GET /categories - List template categories

### Ad Creation Service

**Responsibility**: Handles ad creation, editing, and storage.

**Key Components**:
- Ad CRUD operations
- Ad content storage
- Ad versioning
- Project management

**Database**: MongoDB (ads, projects, versions)

**APIs**:
- POST /ads - Create ad
- GET /ads - List ads
- GET /ads/:id - Get ad details
- PUT /ads/:id - Update ad
- DELETE /ads/:id - Delete ad
- POST /ads/:id/duplicate - Duplicate ad
- POST /ads/:id/versions - Create version
- GET /ads/:id/versions - List versions

### Publishing Service

**Responsibility**: Manages ad publishing to different platforms.

**Key Components**:
- Platform-specific formatters
- Publishing queue
- Campaign management
- Scheduling
- Platform API integrations

**Database**: MongoDB (publishing history, campaigns), Redis (publishing queue)

**APIs**:
- POST /publish - Publish ad
- GET /publish/history - Get publishing history
- POST /campaigns - Create campaign
- GET /campaigns - List campaigns
- GET /platforms - List supported platforms

### Analytics Service

**Responsibility**: Collects and processes analytics data.

**Key Components**:
- Data collection
- Report generation
- A/B testing
- Performance tracking

**Database**: PostgreSQL (analytics data, reports)

**APIs**:
- GET /analytics/ads/:id - Get ad performance
- GET /analytics/dashboard - Get dashboard metrics
- POST /analytics/reports - Generate custom report
- GET /analytics/campaigns/:id - Get campaign performance
- POST /experiments - Create A/B test

## Database Schema Design

### MongoDB Collections

#### Users Collection
```
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String,
  teams: [ObjectId],
  preferences: {
    theme: String,
    notifications: Boolean
  },
  createdAt: Date,
  lastLogin: Date
}
```

#### Assets Collection
```
{
  _id: ObjectId,
  name: String,
  type: String,
  url: String,
  key: String,
  ownerId: ObjectId,
  size: Number,
  tags: [String],
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### Templates Collection
```
{
  _id: ObjectId,
  name: String,
  category: String,
  thumbnailUrl: String,
  isPremium: Boolean,
  dimensions: {
    width: Number,
    height: Number
  },
  content: {
    elements: [
      {
        id: String,
        type: String,
        properties: Object,
        position: Object,
        style: Object
      }
    ],
    background: Object
  },
  tags: [String],
  creatorId: ObjectId,
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Ads Collection
```
{
  _id: ObjectId,
  name: String,
  projectId: ObjectId,
  ownerId: ObjectId,
  templateId: ObjectId,
  dimensions: {
    width: Number,
    height: Number
  },
  content: {
    elements: [
      {
        id: String,
        type: String,
        properties: Object,
        position: Object,
        style: Object
      }
    ],
    background: Object
  },
  thumbnailUrl: String,
  versions: [
    {
      versionId: String,
      createdAt: Date,
      content: Object
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```
{
  _id: ObjectId,
  name: String,
  description: String,
  ownerId: ObjectId,
  teamId: ObjectId,
  adCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL Tables

#### Analytics Schema

**ad_performance Table**
```sql
CREATE TABLE ad_performance (
  id SERIAL PRIMARY KEY,
  ad_id VARCHAR(24) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,4),
  cpc DECIMAL(10,2),
  date DATE NOT NULL,
  UNIQUE(ad_id, platform, date)
);
```

**campaign_performance Table**
```sql
CREATE TABLE campaign_performance (
  id SERIAL PRIMARY KEY,
  campaign_id VARCHAR(24) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,4),
  cpc DECIMAL(10,2),
  date DATE NOT NULL,
  UNIQUE(campaign_id, platform, date)
);
```

**experiments Table**
```sql
CREATE TABLE experiments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  original_ad_id VARCHAR(24) NOT NULL,
  variant_ad_id VARCHAR(24) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  winner_ad_id VARCHAR(24),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend Architecture

The frontend application is built using React with the following architecture:

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Application Shell                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │    Router    │  │    Redux     │  │    Theme     │  │  Service  │ │
│  │              │  │    Store     │  │   Provider   │  │  Workers  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
┌───────────────────┐  ┌────────────────┐  ┌───────────────────┐
│   Feature Pages   │  │  Core Layouts  │  │ Shared Components │
│                   │  │                │  │                   │
│ ┌───────────────┐ │  │ ┌────────────┐ │  │ ┌───────────────┐ │
│ │   Dashboard   │ │  │ │   Header   │ │  │ │    Buttons    │ │
│ └───────────────┘ │  │ └────────────┘ │  │ └───────────────┘ │
│                   │  │                │  │                   │
│ ┌───────────────┐ │  │ ┌────────────┐ │  │ ┌───────────────┐ │
│ │  Ad Editor    │ │  │ │  Sidebar   │ │  │ │     Forms     │ │
│ └───────────────┘ │  │ └────────────┘ │  │ └───────────────┘ │
│                   │  │                │  │                   │
│ ┌───────────────┐ │  │ ┌────────────┐ │  │ ┌───────────────┐ │
│ │ Asset Library │ │  │ │   Footer   │ │  │ │    Modals     │ │
│ └───────────────┘ │  │ └────────────┘ │  │ └───────────────┘ │
│                   │  │                │  │                   │
└───────────────────┘  └────────────────┘  └───────────────────┘
        │                      │                    │
        └──────────────────────┼────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────┐
│                     Services & State Management                    │
│                                                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ API Services │   │ Redux Slices │   │ Custom React Hooks   │   │
│  └──────────────┘   └──────────────┘   └──────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Key Frontend Components

#### Ad Editor
The ad editor is built using Fabric.js and consists of several components:

```
┌─────────────────────────────────────────────────────────────────┐
│                           Ad Editor                             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────────────────┐  ┌─────────────┐  │
│  │             │  │                         │  │             │  │
│  │             │  │                         │  │             │  │
│  │             │  │                         │  │             │  │
│  │   Layers    │  │      Canvas Area        │  │ Properties  │  │
│  │   Panel     │  │                         │  │   Panel     │  │
│  │             │  │                         │  │             │  │
│  │             │  │                         │  │             │  │
│  │             │  │                         │  │             │  │
│  └─────────────┘  └─────────────────────────┘  └─────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                       Toolbar                               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Infrastructure and Deployment

The AdCraft platform is deployed on AWS using a containerized infrastructure with Kubernetes:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AWS Infrastructure                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      VPC                                    │    │
│  │                                                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │    │
│  │  │  Public     │  │  Private    │  │  Private    │          │    │
│  │  │  Subnet     │  │  Subnet     │  │  Subnet     │          │    │
│  │  │  (ALB)      │  │  (EKS)      │  │  (RDS/DocDB)│          │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────┐  ┌─────────────┐  ┌───────────────┐  ┌─────────┐ │
│  │ Route 53      │  │ CloudFront  │  │ Certificate   │  │  WAF    │ │
│  │ (DNS)         │  │ (CDN)       │  │ Manager (SSL) │  │         │ │
│  └───────────────┘  └─────────────┘  └───────────────┘  └─────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EKS Cluster                                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      Node Group                             │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │ API Gateway  │  │ Auth Service │  │ Asset Service│       │    │
│  │  │  Pods        │  │    Pods      │  │    Pods      │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │ Template     │  │ Ad Creation  │  │ Publishing   │       │    │
│  │  │ Service Pods │  │ Service Pods │  │ Service Pods │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  │                                                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │ Analytics    │  │ Frontend     │  │ Shared       │       │    │
│  │  │ Service Pods │  │    Pods      │  │ Service Pods │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Deployment Strategy

The deployment strategy uses a CI/CD pipeline with the following workflow:

1. **Build Pipeline**:
   - Code is pushed to GitHub
   - GitHub Actions trigger automated tests
   - Docker images are built and tagged with Git SHA
   - Images are pushed to ECR

2. **Staging Deployment**:
   - Images are deployed to staging EKS cluster
   - Integration tests are run
   - Manual approval for production deployment

3. **Production Deployment**:
   - Blue/Green deployment strategy
   - Terraform applies infrastructure changes
   - New version is deployed to green environment
   - Traffic is gradually shifted from blue to green
   - Rollback capability if issues are detected

## Integration Points

### Third-Party Service Integrations

1. **Authentication Providers**:
   - Google OAuth
   - Facebook Login
   - Apple ID

2. **Payment Processing**:
   - Stripe for subscription management
   - PayPal for alternative payment method

3. **Ad Platforms**:
   - Facebook Ads API
   - Google Ads API
   - LinkedIn Ads API
   - Twitter Ads API
   - TikTok Ads API

4. **Analytics Providers**:
   - Google Analytics
   - Mixpanel
   - HotJar

5. **Email Services**:
   - Amazon SES
   - SendGrid

## Scalability Considerations

The architecture is designed for horizontal scalability with the following considerations:

1. **Stateless Services**:
   - All microservices are designed to be stateless
   - Session state is stored in Redis
   - Authentication uses JWT tokens

2. **Database Scaling**:
   - MongoDB sharding for document stores
   - PostgreSQL read replicas for analytics
   - Connection pooling

3. **Caching Strategy**:
   - Redis for application caching
   - CloudFront for CDN caching
   - In-memory caching for frequent operations

4. **Auto-Scaling**:
   - EKS node auto-scaling based on CPU/memory
   - Service-level scaling based on custom metrics
   - Database connection auto-scaling

## Security Considerations

1. **Authentication & Authorization**:
   - JWT tokens with short expiration
   - Refresh token rotation
   - Role-based access control
   - API Gateway authentication

2. **Data Protection**:
   - Encryption at rest for all data stores
   - TLS for all communications
   - API request validation

3. **Network Security**:
   - VPC with private subnets
   - Security groups limiting access
   - WAF for API Gateway
   - Regular vulnerability scanning

4. **Compliance**:
   - GDPR compliance for user data
   - CCPA provisions
   - Audit logging for sensitive operations

## Monitoring and Observability

1. **Logging**:
   - Centralized logging with CloudWatch Logs
   - Structured logging format
   - Log retention policies

2. **Metrics**:
   - Custom application metrics
   - Infrastructure metrics
   - Business metrics

3. **Tracing**:
   - Distributed tracing with X-Ray
   - Request ID propagation
   - Service dependency mapping

4. **Alerting**:
   - CloudWatch Alarms
   - PagerDuty integration
   - Slack notifications

## Disaster Recovery

1. **Backup Strategy**:
   - Daily database backups
   - Cross-region replication for S3
   - Configuration backups with Terraform state

2. **Recovery Plans**:
   - RTO (Recovery Time Objective): 1 hour
   - RPO (Recovery Point Objective): 15 minutes
   - Documented recovery procedures

3. **Failover Mechanisms**:
   - Multi-AZ deployments
   - Database failover testing
   - Regular DR drills