# Vercel Deployment Guide

## Overview

This guide provides comprehensive step-by-step instructions for deploying the Advanced MERN AI Financial SaaS Platform to Vercel. The platform consists of a React frontend built with Vite and TypeScript, and a Node.js/Express backend that will be deployed as serverless functions.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Node.js**: Version 18.0.0 or higher
4. **Environment Variables**: Prepare all required environment variables (see section below)
5. **External Services**: Set up MongoDB Atlas, Cloudinary, Google AI, and Resend accounts

## Project Structure

```
Advanced-MERN-AI-Financial-SaaS-Platform/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/               # Source code
│   ├── dist/              # Build output (generated)
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── backend/               # Express backend (becomes serverless functions)
│   ├── src/               # Source code
│   ├── dist/              # Build output (generated)
│   └── package.json       # Backend dependencies
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json for monorepo
└── DEPLOYMENT.md         # This deployment guide
```

## Environment Variables

### Required Backend Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Google AI (Gemini) Configuration
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary Configuration (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_MAILER_SENDER=noreply@yourdomain.com

# CORS Configuration
FRONTEND_ORIGIN=https://yourdomain.vercel.app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Optional: Stripe Configuration (if payment features are enabled)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional: Additional Security
BCRYPT_SALT_ROUNDS=12
```

### Required Frontend Environment Variables

Set these with `VITE_` prefix for client-side access:

```bash
# API Configuration
VITE_API_BASE_URL=https://yourdomain.vercel.app/api

# Optional: Stripe Configuration (if payment features are enabled)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional: Analytics Configuration
VITE_ANALYTICS_ID=your_analytics_id
```

### Environment Variable Templates

Create `.env.example` files in both client and backend directories:

**Backend `.env.example`:**
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
RESEND_MAILER_SENDER=noreply@yourdomain.com
FRONTEND_ORIGIN=https://yourdomain.vercel.app
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

**Client `.env.example`:**
```bash
VITE_API_BASE_URL=https://yourdomain.vercel.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Deployment Steps

### 1. Pre-Deployment Setup

1. **Clone and Install Dependencies**:
   ```bash
   git clone <your-repo-url>
   cd Advanced-MERN-AI-Financial-SaaS-Platform
   npm run install:all
   ```

2. **Validate Configuration**:
   ```bash
   npm run validate
   ```

3. **Test Local Build**:
   ```bash
   npm run build
   ```

### 2. Vercel Configuration

The `vercel.json` file is configured with:

- **Static Build**: React frontend served as static files
- **Serverless Functions**: Express backend converted to serverless functions
- **Routing**: Proper API routing and SPA fallback
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **HTTPS Redirection**: Automatic HTTP to HTTPS redirection
- **Scheduled Functions**: Monthly report generation cron job
- **Performance**: Optimized caching and compression

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Initial Deployment**:
   ```bash
   vercel
   ```
   Follow the prompts to configure your project.

3. **Production Deployment**:
   ```bash
   npm run deploy
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGO_URI production
   vercel env add GEMINI_API_KEY production
   vercel env add CLOUDINARY_CLOUD_NAME production
   vercel env add CLOUDINARY_API_KEY production
   vercel env add CLOUDINARY_API_SECRET production
   vercel env add RESEND_API_KEY production
   vercel env add RESEND_MAILER_SENDER production
   vercel env add FRONTEND_ORIGIN production
   vercel env add JWT_SECRET production
   vercel env add VITE_API_BASE_URL production
   ```

#### Option B: Deploy via Git Integration

1. **Push to GitHub/GitLab/Bitbucket**
2. **Import Project in Vercel Dashboard**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Configure build settings:
     - Framework Preset: Other
     - Build Command: `npm run build`
     - Output Directory: `client/dist`
     - Install Command: `npm run install:all`
   - Add environment variables
   - Deploy

### 4. Post-Deployment Configuration

#### Domain Setup

1. **Add Custom Domain**:
   - Go to Project Settings > Domains
   - Add your custom domain (e.g., `yourdomain.com`)
   - Add www variant (e.g., `www.yourdomain.com`)
   - Configure DNS records as instructed by Vercel

2. **DNS Configuration**:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Certificates auto-renew before expiration
   - HTTPS redirection is configured automatically

#### Monitoring and Analytics Setup

1. **Enable Vercel Analytics**:
   - Go to Project Settings > Analytics
   - Enable Web Analytics
   - Enable Speed Insights

2. **Set up Deployment Notifications**:
   - Go to Project Settings > Git
   - Configure deployment notifications
   - Set up Slack/Discord webhooks if needed

3. **Error Monitoring**:
   - Monitor function logs in Vercel dashboard
   - Set up external monitoring (optional)

## Build Configuration Details

### Frontend Build Process

The frontend build process includes:

1. **TypeScript Compilation**: All TypeScript files compiled to JavaScript
2. **Asset Optimization**: Images, CSS, and JS files optimized and minified
3. **Environment Variable Injection**: `VITE_*` variables injected at build time
4. **Static File Generation**: SPA with client-side routing support
5. **Code Splitting**: Automatic code splitting for optimal loading

### Backend Build Process

The backend is converted to serverless functions:

1. **TypeScript Compilation**: Backend TypeScript compiled to JavaScript
2. **Express App Export**: Main app exported as serverless function
3. **Route Handling**: All Express routes handled through Vercel routing
4. **Database Optimization**: Connection pooling optimized for serverless
5. **Middleware Adaptation**: All middleware adapted for serverless environment

## Security Configuration

### Implemented Security Measures

1. **HTTPS Enforcement**: All traffic redirected to HTTPS
2. **Security Headers**:
   - Content Security Policy (CSP)
   - HTTP Strict Transport Security (HSTS)
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy

3. **CORS Configuration**: Restricted to authorized origins
4. **Input Validation**: All API endpoints validate input data
5. **Environment Variable Protection**: Sensitive data secured
6. **JWT Authentication**: Secure token-based authentication

### Additional Security Recommendations

1. **Regular Updates**: Keep dependencies updated
2. **Security Scanning**: Regular vulnerability scans
3. **Rate Limiting**: Implement API rate limiting
4. **API Key Rotation**: Regular rotation of API keys
5. **Monitoring**: Monitor for suspicious activity

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Asset Compression**: Gzip compression enabled
- **CDN Distribution**: Global CDN via Vercel Edge Network
- **Caching**: Optimal caching headers for static assets
- **Image Optimization**: Automatic image optimization

### Backend Optimization

- **Connection Pooling**: MongoDB connection pooling
- **Cold Start Optimization**: Minimized serverless cold starts
- **Caching Headers**: Appropriate caching for API responses
- **Function Duration**: Optimized function execution time
- **Memory Allocation**: Right-sized function memory

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   ```bash
   # Check build logs
   vercel logs <deployment-url>
   
   # Test build locally
   npm run build
   
   # Check TypeScript errors
   npm run lint
   ```

2. **Environment Variable Issues**:
   ```bash
   # List environment variables
   vercel env ls
   
   # Add missing variables
   vercel env add VARIABLE_NAME production
   ```

3. **API Connection Issues**:
   - Verify `VITE_API_BASE_URL` matches deployment URL
   - Check CORS configuration in backend
   - Ensure all backend environment variables are set

4. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas (allow all: 0.0.0.0/0)
   - Ensure database user has proper permissions

5. **File Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits (Vercel: 4.5MB for serverless functions)
   - Ensure proper CORS configuration

### Debugging Commands

```bash
# View deployment logs
vercel logs <deployment-url>

# View function logs
vercel logs <deployment-url> --follow

# Test API endpoints
curl https://yourdomain.vercel.app/api/health

# Check deployment status
vercel ls

# Inspect deployment
vercel inspect <deployment-url>
```

### Performance Monitoring

1. **Vercel Analytics**: Monitor Core Web Vitals
2. **Function Metrics**: Monitor execution time and memory usage
3. **Error Rates**: Track API error rates and response times
4. **Database Performance**: Monitor MongoDB Atlas metrics

## Maintenance and Updates

### Regular Maintenance Tasks

1. **Dependency Updates**:
   ```bash
   npm audit
   npm update
   npm run validate
   ```

2. **Security Updates**:
   - Monitor security advisories
   - Update dependencies with security patches
   - Rotate API keys regularly

3. **Performance Monitoring**:
   - Review Vercel Analytics
   - Monitor function execution times
   - Check database performance metrics

4. **Backup and Recovery**:
   - Regular database backups
   - Test restore procedures
   - Document recovery processes

### Scaling Considerations

- **Vercel Pro Plan**: Consider upgrading for higher limits
- **Database Scaling**: Monitor MongoDB Atlas usage
- **CDN Optimization**: Leverage Vercel's global CDN
- **Function Optimization**: Optimize serverless function performance

## Rollback Procedures

### Immediate Rollback

```bash
# Rollback to previous deployment
vercel rollback <previous-deployment-url>

# Or use dashboard
# Go to Vercel Dashboard > Deployments > Promote previous deployment
```

### Emergency Procedures

1. **Critical Issues**:
   - Use Vercel Dashboard to promote previous stable deployment
   - Investigate issues in development environment
   - Fix and redeploy when ready

2. **Database Issues**:
   - Restore from MongoDB Atlas backup
   - Update connection strings if needed
   - Verify data integrity

## Support and Resources

### Documentation Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

### Getting Help

1. **Check Deployment Logs**: First step for any issues
2. **Review This Guide**: Comprehensive troubleshooting section
3. **Vercel Community**: [vercel.com/community](https://vercel.com/community)
4. **Project Issues**: Check GitHub issues for known problems

### Emergency Contacts

- **Vercel Support**: Available for Pro plan users
- **MongoDB Atlas Support**: Database-related issues
- **Project Maintainer**: [Your contact information]

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Deployment Target**: Vercel Platform