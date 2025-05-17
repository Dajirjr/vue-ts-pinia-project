# Deploy to Vercel

## Prerequisites
- Node.js 18 or later
- npm or yarn
- A Vercel account
- Git repository (optional but recommended)

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Prepare Your Project
1. Ensure your `package.json` has the correct build script:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

2. Add a `vercel.json` configuration (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Step 3: Deploy

### Option 1: Using Vercel CLI
1. Login to Vercel:
```bash
vercel login
```

2. Deploy your project:
```bash
vercel
```

3. For subsequent deployments:
```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

## Step 4: Configure Environment Variables
1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add your environment variables:
```
VITE_API_URL=https://api.example.com
```

## Step 5: Set Up Custom Domain (Optional)
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

## Automatic Deployments
- Vercel automatically deploys when you push to your repository
- Preview deployments are created for pull requests
- Production deployments happen on merge to main branch

## Monitoring and Analytics
1. View deployment status in Dashboard
2. Monitor performance metrics
3. Check error logs
4. Analyze analytics data

## Troubleshooting
Common issues and solutions:

1. Build Failures
   - Check build logs
   - Verify dependencies
   - Validate build command

2. Runtime Errors
   - Check browser console
   - Review server logs
   - Verify environment variables

3. Performance Issues
   - Enable automatic minification
   - Configure caching headers
   - Optimize assets

## Best Practices
1. Use environment variables for sensitive data
2. Enable automatic HTTPS
3. Configure proper caching
4. Set up error monitoring
5. Use preview deployments for testing

## Additional Features
- Edge Functions
- Image Optimization
- Serverless Functions
- Analytics
- Team Collaboration