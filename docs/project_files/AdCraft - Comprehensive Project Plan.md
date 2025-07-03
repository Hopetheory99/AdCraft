# AdCraft: Comprehensive Project Plan

This document outlines a detailed roadmap for building the AdCraft platform, combining clear timeline structure with technical implementation details. Each phase is broken down into specific sprints with deliverables, technical requirements, and implementation strategies.

## Project Overview

AdCraft is a comprehensive platform designed to streamline the creation, management, and optimization of digital advertisements across multiple formats and channels. The platform aims to democratize high-quality ad creation by providing intuitive tools that blend creativity with data-driven insights.

## Development Approach

We will implement AdCraft using a microservices architecture within an NX monorepo, allowing for modular development, independent scaling, and clear service boundaries. The development process will follow an agile methodology with two-week sprints and regular reviews.

## Resource Allocation

- 2 Frontend Developers (React, TypeScript)
- 2 Backend Developers (Node.js, NestJS)
- 1 DevOps Engineer
- 1 UI/UX Designer
- 1 QA Specialist
- 1 Product Manager

## Technology Stack

### Frontend

- React v18 with TypeScript
- Material-UI v5 for component library
- Redux Toolkit for state management
- Fabric.js for canvas-based editing
- React Router for navigation
- Axios for API requests
- Jest and React Testing Library for testing

### Backend

- Node.js with TypeScript
- NestJS for microservices framework
- Express.js for API gateway
- MongoDB for document storage
- PostgreSQL for analytics data
- Redis for caching and session management

### DevOps & Infrastructure

- Docker and Docker Compose for containerization
- Kubernetes for orchestration
- Terraform for infrastructure as code
- AWS (ECS, S3, CloudFront, RDS, etc.)
- GitHub Actions for CI/CD
- Prometheus and Grafana for monitoring

### Mobile

- React Native / Expo for cross-platform mobile apps

### Third-Party Services

- Stripe for payment processing
- AWS Rekognition for image analysis
- OAuth providers for social login

## Project Phases and Sprints

### Phase 1: Foundation & Core Architecture (Weeks 1-4)

#### Sprint 1.1: Project Setup & CI/CD (Week 1)

**Objectives:**

- Initialize project structure
- Set up development environment
- Configure CI/CD pipeline

**Technical Implementation:**

```bash
# Initialize NX monorepo
npx create-nx-workspace@latest adcraft --preset=ts
cd adcraft

# Add React application
nx g @nrwl/react:app frontend

# Add NestJS applications for each microservice
nx g @nrwl/nest:app auth-service
nx g @nrwl/nest:app ad-creation-service
nx g @nrwl/nest:app asset-service
nx g @nrwl/nest:app template-service
nx g @nrwl/nest:app publishing-service
nx g @nrwl/nest:app analytics-service

# Add shared libraries
nx g @nrwl/js:lib shared-types
nx g @nrwl/js:lib shared-utils
```

**Docker Configuration:**

```dockerfile
# Base Node.js image for all services
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Frontend build
FROM base AS frontend-builder
RUN npx nx build frontend --prod

# Service build (example for auth-service)
FROM base AS auth-service-builder
RUN npx nx build auth-service --prod

# Frontend runtime
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/dist/apps/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Service runtime (example for auth-service)
FROM node:18-alpine AS auth-service
COPY --from=auth-service-builder /app/dist/apps/auth-service /app
WORKDIR /app
EXPOSE 3001
CMD ["node", "main.js"]
```

**GitHub Actions Workflow:**

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npx nx run-many --target=lint --all

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npx nx run-many --target=test --all
```

**Deliverables:**

- NX monorepo structure with microservices
- Docker containerization for all services
- CI/CD pipeline with GitHub Actions
- Development environment setup documentation

#### Sprint 1.2: Authentication & User Management (Weeks 2-3)

**Objectives:**

- Implement user authentication service
- Create user registration and login flows
- Set up role-based access control
- Configure user database schema

**Technical Implementation:**

**User Model (shared-types):**

```typescript
// libs/shared-types/src/lib/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  teams: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
```

**Authentication Service (NestJS):**

```typescript
// apps/auth-service/src/app/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '@adcraft/shared-types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(registerRequest: RegisterRequest): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.usersService.create({
      ...registerRequest,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user);

    return {
      user,
      tokens,
    };
  }

  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginRequest.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    await this.usersService.updateLastLogin(user.id);

    return {
      user,
      tokens,
    };
  }

  private generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
```

**Frontend Authentication Components:**

```typescript
// apps/frontend/src/app/features/auth/Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = data => {
    dispatch(login(data));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Login to AdCraft
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
```

**Deliverables:**

- Authentication service with JWT implementation
- User registration and login endpoints
- User database schema in MongoDB
- Frontend login/register UI components
- Role-based access control middleware

#### Sprint 1.3: API Gateway & Service Foundation (Week 4)

**Objectives:**

- Set up API Gateway for request routing
- Implement inter-service communication
- Configure basic logging and monitoring
- Deploy infrastructure with Terraform

**Technical Implementation:**

**API Gateway Configuration:**

```typescript
// apps/api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global middleware
  app.use(helmet());
  app.use(compression());
  app.enableCors();

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('AdCraft API')
    .setDescription('The AdCraft API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

**Terraform Infrastructure:**

```hcl
# infrastructure/main.tf
provider "aws" {
  region = var.aws_region
}

# VPC and Network Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "adcraft-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"

  tags = {
    Environment = var.environment
    Project     = "adcraft"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "adcraft" {
  name = "adcraft-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Project     = "adcraft"
  }
}

# MongoDB DocumentDB Cluster
resource "aws_docdb_cluster" "mongodb" {
  cluster_identifier      = "adcraft-mongodb-${var.environment}"
  engine                  = "docdb"
  master_username         = var.mongodb_username
  master_password         = var.mongodb_password
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = var.environment != "production"

  vpc_security_group_ids = [aws_security_group.mongodb.id]
  db_subnet_group_name   = aws_docdb_subnet_group.mongodb.name

  tags = {
    Environment = var.environment
    Project     = "adcraft"
  }
}

# Additional resources for ECS services, ALB, ECR repositories, etc.
```

**Deliverables:**

- API Gateway with routing and middleware
- Inter-service communication setup
- AWS infrastructure deployed with Terraform
- Basic logging and monitoring configuration
- API documentation with Swagger

### Phase 2: Core Features Development (Weeks 5-10)

#### Sprint 2.1: Asset Management (Week 5)

**Objectives:**

- Implement S3 integration for media storage
- Create asset upload service
- Build asset library UI
- Add image processing capabilities

**Technical Implementation:**

**Asset Service (NestJS):**

```typescript
// apps/asset-service/src/app/assets/assets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Asset } from './schemas/asset.schema';
import { CreateAssetDto } from './dto/create-asset.dto';
import * as sharp from 'sharp';

@Injectable()
export class AssetsService {
  private s3: S3;

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private configService: ConfigService,
  ) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async uploadAsset(
    file: Express.Multer.File,
    createAssetDto: CreateAssetDto,
    userId: string,
  ): Promise<Asset> {
    // Process image if needed
    let processedFile = file;
    if (file.mimetype.includes('image')) {
      const processedBuffer = await sharp(file.buffer)
        .resize(2000) // Max width
        .withMetadata()
        .toBuffer();

      processedFile = {
        ...file,
        buffer: processedBuffer,
      };
    }

    // Upload to S3
    const key = `${userId}/${Date.now()}-${file.originalname}`;
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: key,
        Body: processedFile.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
      })
      .promise();

    // Create asset record
    const asset = new this.assetModel({
      name: createAssetDto.name || file.originalname,
      type: file.mimetype,
      url: uploadResult.Location,
      key: uploadResult.Key,
      ownerId: userId,
      size: file.size,
      tags: createAssetDto.tags || [],
      metadata: createAssetDto.metadata || {},
    });

    return asset.save();
  }

  // Additional methods for listing, getting, deleting assets
}
```

**Asset Library UI Component:**

```tsx
// apps/frontend/src/app/features/assets/AssetLibrary.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets, uploadAsset } from '../../store/slices/assetsSlice';
import { RootState } from '../../store';
import { Grid, Paper, Typography, Button, Box, TextField, Chip } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AssetCard from './AssetCard';
import AssetUploadDialog from './AssetUploadDialog';

const AssetLibrary = () => {
  const dispatch = useDispatch();
  const { assets, loading } = useSelector((state: RootState) => state.assets);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const filteredAssets = assets.filter(
    asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Asset Library</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Asset
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search assets by name or tag"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {loading ? (
          <Typography>Loading assets...</Typography>
        ) : filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
              <AssetCard asset={asset} />
            </Grid>
          ))
        ) : (
          <Typography>No assets found. Upload some assets to get started.</Typography>
        )}
      </Grid>

      <AssetUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(files, data) => {
          files.forEach(file => {
            dispatch(uploadAsset({ file, ...data }));
          });
          setUploadDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default AssetLibrary;
```

**Deliverables:**

- S3 integration for asset storage
- Asset upload service with image processing
- Asset management API endpoints
- Asset library UI with search and filtering
- Asset metadata and tagging functionality

#### Sprint 2.2: Ad Editor Foundation (Weeks 6-7)

**Objectives:**

- Implement canvas-based editor
- Create basic editing tools
- Build layer management system
- Implement property panel for editing

**Technical Implementation:**

**Ad Editor Component:**

```tsx
// apps/frontend/src/app/features/editor/AdEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
import { Box, Grid, Paper } from '@mui/material';
import { RootState } from '../../store';
import { loadAd, saveAd } from '../../store/slices/adsSlice';

import EditorToolbar from './EditorToolbar';
import PropertyPanel from './PropertyPanel';
import LayersPanel from './LayersPanel';
import CanvasContainer from './CanvasContainer';

const AdEditor = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const { currentAd, loading } = useSelector((state: RootState) => state.ads);

  useEffect(() => {
    if (adId) {
      dispatch(loadAd(adId));
    }
  }, [adId, dispatch]);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvas) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 1200,
        height: 628,
        backgroundColor: '#ffffff',
      });

      canvas.on('selection:created', e => {
        setSelectedElement(e.target);
      });

      canvas.on('selection:updated', e => {
        setSelectedElement(e.target);
      });

      canvas.on('selection:cleared', () => {
        setSelectedElement(null);
      });

      setFabricCanvas(canvas);
    }

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
    };
  }, [canvasRef]);

  useEffect(() => {
    if (currentAd && fabricCanvas) {
      // Load ad content into canvas
      fabricCanvas.clear();

      if (currentAd.content && currentAd.content.elements) {
        currentAd.content.elements.forEach(element => {
          switch (element.type) {
            case 'text':
              const text = new fabric.Text(element.properties.text, {
                left: element.position.left,
                top: element.position.top,
                fontFamily: element.style.fontFamily,
                fontSize: element.style.fontSize,
                fill: element.style.color,
              });
              fabricCanvas.add(text);
              break;

            case 'image':
              fabric.Image.fromURL(element.properties.src, img => {
                img.set({
                  left: element.position.left,
                  top: element.position.top,
                  scaleX: element.style.scaleX,
                  scaleY: element.style.scaleY,
                });
                fabricCanvas.add(img);
              });
              break;

            // Add other element types as needed
          }
        });
      }

      // Set background
      if (currentAd.content && currentAd.content.background) {
        fabricCanvas.setBackgroundColor(
          currentAd.content.background.color || '#ffffff',
          fabricCanvas.renderAll.bind(fabricCanvas),
        );
      }
    }
  }, [currentAd, fabricCanvas]);

  const handleSave = () => {
    if (!fabricCanvas || !currentAd) return;

    // Extract canvas elements
    const elements = fabricCanvas.getObjects().map(obj => {
      if (obj instanceof fabric.Text) {
        return {
          id: obj.id || `text_${Date.now()}`,
          type: 'text',
          properties: {
            text: obj.text,
          },
          position: {
            left: obj.left,
            top: obj.top,
          },
          style: {
            fontFamily: obj.fontFamily,
            fontSize: obj.fontSize,
            color: obj.fill,
          },
        };
      }

      if (obj instanceof fabric.Image) {
        return {
          id: obj.id || `image_${Date.now()}`,
          type: 'image',
          properties: {
            src: obj.getSrc(),
          },
          position: {
            left: obj.left,
            top: obj.top,
          },
          style: {
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
          },
        };
      }

      // Add other object types as needed
    });

    const updatedAd = {
      ...currentAd,
      content: {
        elements,
        background: {
          color: fabricCanvas.backgroundColor,
        },
      },
      modifiedAt: new Date().toISOString(),
    };

    dispatch(saveAd(updatedAd));
  };

  return (
    <Box sx={{ flexGrow: 1, height: 'calc(100vh - 64px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <EditorToolbar canvas={fabricCanvas} onSave={handleSave} />
        </Grid>
        <Grid item xs={2}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <LayersPanel canvas={fabricCanvas} selectedElement={selectedElement} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CanvasContainer canvasRef={canvasRef} />
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <PropertyPanel selectedElement={selectedElement} canvas={fabricCanvas} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdEditor;
```

**Deliverables:**

- Canvas-based editor with Fabric.js
- Basic shape and text editing tools
- Layer management system
- Property panel for element editing
- Save and load functionality for ads

#### Sprint 2.3: Template System (Weeks 8-9)

**Objectives:**

- Design template data schema
- Implement template creation and management
- Build template gallery UI
- Add template categorization

**Technical Implementation:**

**Template Schema (NestJS):**

```typescript
// apps/template-service/src/app/templates/schemas/template.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Template extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: Object, required: true })
  dimensions: {
    width: number;
    height: number;
  };

  @Prop({ type: Object, required: true })
  content: {
    elements: Array<{
      id: string;
      type: string;
      properties: Record<string, any>;
      position: Record<string, number>;
      style: Record<string, any>;
    }>;
    background: Record<string, any>;
  };

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  creatorId: string;

  @Prop({ default: false })
  isPublic: boolean;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
```

**Template Gallery Component:**

```tsx
// apps/frontend/src/app/features/templates/TemplateGallery.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates } from '../../store/slices/templatesSlice';
import { RootState } from '../../store';
import {
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';

const TemplateGallery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { templates, categories, loading } = useSelector((state: RootState) => state.templates);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = templateId => {
    navigate(`/editor/new?templateId=${templateId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Template Gallery
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search templates"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Typography>Loading templates...</Typography>
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={template.thumbnailUrl}
                  alt={template.name}
                />
                <CardContent>
                  <Typography variant="h6">{template.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {template.category}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {template.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No templates found matching your criteria.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default TemplateGallery;
```

**Deliverables:**

- Template data schema and API
- Template creation and management
- Template gallery UI with filtering
- Template categorization and tagging
- Template application to ad editor

#### Sprint 2.4: Basic Dashboard & Preview (Week 10)

**Objectives:**

- Build user dashboard interface
- Implement project management
- Create ad preview functionality
- Add basic export capabilities

**Technical Implementation:**

**Dashboard Component:**

```tsx
// apps/frontend/src/app/features/dashboard/Dashboard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { fetchRecentAds } from '../../store/slices/adsSlice';
import { RootState } from '../../store';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects } = useSelector((state: RootState) => state.projects);
  const { recentAds } = useSelector((state: RootState) => state.ads);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchRecentAds());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Welcome, {user?.name}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/editor/new')}>
          Create New Ad
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Ads</Typography>
              <List>
                {recentAds.length > 0 ? (
                  recentAds.map(ad => (
                    <ListItem
                      key={ad.id}
                      secondaryAction={
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/editor/${ad.id}`)}
                        >
                          Edit
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={ad.thumbnailUrl} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={ad.name}
                        secondary={`Last modified: ${new Date(ad.modifiedAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No recent ads. Create your first ad now!</Typography>
                )}
              </List>
            </CardContent>
            <CardActions>
              <Button onClick={() => navigate('/ads')}>View All Ads</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Projects</Typography>
              <List>
                {projects.length > 0 ? (
                  projects.map(project => (
                    <ListItem
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      button
                    >
                      <ListItemText primary={project.name} secondary={`${project.adCount} ads`} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No projects yet. Create your first project!</Typography>
                )}
              </List>
            </CardContent>
            <CardActions>
              <Button startIcon={<AddIcon />} onClick={() => navigate('/projects/new')}>
                Create Project
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

**Ad Preview Component:**

```tsx
// apps/frontend/src/app/features/preview/AdPreview.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadAd, renderAd } from '../../store/slices/adsSlice';
import { RootState } from '../../store';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const AdPreview = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { currentAd, renderUrl, rendering } = useSelector((state: RootState) => state.ads);

  const [platform, setPlatform] = useState('facebook');
  const [format, setFormat] = useState('png');

  useEffect(() => {
    if (adId) {
      dispatch(loadAd(adId));
    }
  }, [adId, dispatch]);

  const handleRender = () => {
    dispatch(renderAd({ adId, platform, format }));
  };

  const handleDownload = () => {
    if (renderUrl) {
      const link = document.createElement('a');
      link.href = renderUrl;
      link.download = `${currentAd.name}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Ad Preview
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Preview Settings
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select value={platform} onChange={e => setPlatform(e.target.value)} label="Platform">
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="display">Display Ad</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={format}
                onChange={e => setFormat(e.target.value)}
                label="Export Format"
              >
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="jpg">JPG</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleRender} disabled={rendering}>
                {rendering ? <CircularProgress size={24} /> : 'Generate Preview'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!renderUrl}
              >
                Download
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 2 }}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderUrl ? (
              <img
                src={renderUrl}
                alt="Ad Preview"
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            ) : (
              <Typography>Generate a preview to see your ad</Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdPreview;
```

**Deliverables:**

- User dashboard with recent ads and projects
- Project management functionality
- Ad preview with platform-specific rendering
- Basic export capabilities (PNG, JPG, PDF)
- MVP platform with core functionality

### Phase 3: Advanced Features (Weeks 11-16)

This phase will focus on adding advanced editing capabilities, publishing integrations, and team collaboration features. Implementation details would follow a similar pattern to those shown in Phase 1 and 2, but with more complex functionality.

#### Sprint 3.1: Advanced Editing Tools (Weeks 11-12)

- Advanced text formatting with typography controls
- Layer effects (shadows, gradients, filters)
- Animation and transition tools
- Smart alignment and distribution features
- Brand asset management system

#### Sprint 3.2: Publishing System (Weeks 13-14)

- Platform-specific formatters for different ad networks
- Campaign management interface
- Scheduling capabilities
- Approval workflows
- Direct publishing to ad platforms via APIs

#### Sprint 3.3: Team Collaboration (Weeks 15-16)

- Team management functionality
- Shared workspaces for team members
- Real-time collaboration on ad designs
- Version history and comparison tools
- Commenting and feedback system

### Phase 4: Analytics & Monetization (Weeks 17-20)

This phase will implement analytics tracking, A/B testing capabilities, and subscription-based monetization.

#### Sprint 4.1: Analytics Implementation (Weeks 17-18)

- Analytics data collection and storage
- Performance dashboards and reports
- Cross-platform metrics aggregation
- Custom report generation
- Data visualization components

#### Sprint 4.2: A/B Testing & Optimization (Week 19)

- A/B testing framework
- Experiment creation and management
- Results analysis and reporting
- Performance recommendation engine
- Automatic optimization suggestions

#### Sprint 4.3: Monetization (Week 20)

- Stripe integration for payments
- Subscription tier management
- Premium feature access control
- Billing and invoice system
- Usage tracking and limits

### Phase 5: Mobile & Refinement (Weeks 21-24)

This phase will focus on mobile app development and overall platform refinement.

#### Sprint 5.1: Mobile App Development (Weeks 21-22)

- React Native/Expo setup
- Core mobile functionality
- Cross-platform asset syncing
- Mobile-specific UI optimizations
- Offline capabilities

#### Sprint 5.2: QA & Testing (Week 23)

- End-to-end testing implementation
- Performance optimization
- Accessibility compliance
- Security testing and hardening
- Bug fixing and refinement

#### Sprint 5.3: Launch Preparation (Week 24)

- Documentation completion
- User guides and tutorials
- Marketing material preparation
- Support system setup
- Final review and approval

### Phase 6: Beta & Production Launch (Weeks 25-28)

The final phase will focus on beta testing, gathering feedback, and preparing for production launch.

#### Sprint 6.1: Beta Release (Weeks 25-26)

- Beta program launch
- User feedback collection and analysis
- Critical improvements implementation
- High-priority issue resolution
- Scaling plan finalization

#### Sprint 6.2: Production Launch (Weeks 27-28)

- Production deployment
- Integration activation
- Monitoring and alerting setup
- Support process establishment
- Marketing and user acquisition launch

## Conclusion

This comprehensive project plan combines clear timeline structure with detailed technical implementation strategies. By following this plan, the AdCraft platform will be built with a scalable microservices architecture, robust features, and a user-friendly interface. The phased approach allows for iterative development, regular milestones, and continuous improvement throughout the project lifecycle.

The development team should use this document as a guide while maintaining flexibility to adapt to changing requirements and technical challenges as they arise. Regular sprint reviews and retrospectives will ensure that the project stays on track and that lessons learned are incorporated into future sprints.
