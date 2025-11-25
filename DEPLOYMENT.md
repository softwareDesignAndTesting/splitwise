# Deploying Splitwise to Vercel

This guide will help you deploy your Splitwise application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) installed (optional but recommended)
3. A MongoDB database (e.g., MongoDB Atlas)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for beginners)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "feat: Add Vercel deployment configuration"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   In the Vercel project settings, add these environment variables:

   **Backend Variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure secret key for JWT tokens
   - `NODE_ENV` - Set to `production`

   **Frontend Variables:**
   - `VITE_API_URL` - Your Vercel backend URL (e.g., `https://your-app.vercel.app`)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts to configure your project.

4. **Add Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add VITE_API_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/splitwise
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-app.vercel.app
```

## Post-Deployment

1. **Update CORS Origins**
   - Update `backend/index.js` to include your Vercel domain in the CORS configuration
   - Add your production URL to the allowed origins

2. **Test Your Application**
   - Visit your Vercel URL
   - Test signup, login, and core features
   - Check browser console for any errors

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure MongoDB is accessible from Vercel

### Database Connection
- Whitelist Vercel IPs in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)
- Verify MongoDB connection string is correct
- Check database user permissions

## Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open project in browser
vercel --open
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)

## Support

If you encounter issues:
1. Check the [Vercel Community](https://github.com/vercel/vercel/discussions)
2. Review [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
3. Check application logs in Vercel dashboard
