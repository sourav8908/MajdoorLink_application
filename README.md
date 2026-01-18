<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MajdoorLink - Service Marketplace

MajdoorLink is a service marketplace application connecting customers with skilled workers in Odisha, India. The platform supports multiple languages and offers various services like plumbing, electrical work, carpentry, and more.

## Features

- Multi-language support (English, Hindi, Odia)
- User roles: Customers, Workers, and Admins
- AI-powered service recommendation
- Skill-based worker categorization
- Responsive design for mobile and desktop

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Google Generative AI (for AI assistant)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `VITE_API_KEY` in [.env.local](.env.local) to your Google API key
3. Run the app:
   `npm run dev`

## Deployment Guide

### Deploying to GitHub Pages

1. **Prerequisites**:
   - A GitHub account
   - Git installed on your machine

2. **Setup**:
   - Fork or clone this repository
   - Install dependencies: `npm install`

3. **Configure for GitHub Pages**:
   - Update `homepage` field in `package.json` to your GitHub Pages URL
   - Ensure `vite.config.ts` has the correct `base` path

4. **Build and Deploy**:
   ```bash
   npm run deploy
   ```
   This will run `npm run build` and then deploy the `dist` folder to the `gh-pages` branch

5. **Access your deployed application**:
   Your app will be available at: `https://yourusername.github.io/repository-name`

### Making Changes and Updating Deployment

1. **Local Development**:
   ```bash
   npm run dev
   ```
   This runs the app in development mode at http://localhost:3000

2. **After Making Changes**:
   - Test locally: `npm run dev`
   - Build to test production version: `npm run build`
   - Preview production build: `npm run preview`

3. **Update GitHub Pages Deployment**:
   ```bash
   npm run deploy
   ```
   This rebuilds the application and pushes the updated build to GitHub Pages

### Environment Variables

If you're using the AI assistant feature, you'll need to set up environment variables:

- Create a `.env.local` file in the root directory
- Add your Google API key: `VITE_API_KEY=your_api_key_here`

> Note: For GitHub Pages deployment, you'll need to set the environment variable in GitHub repository secrets if the AI feature is required in production.

### Troubleshooting

- **Blank Screen Issue**: Check that the `base` property in `vite.config.ts` matches your GitHub repository name
- **Asset Loading Issues**: Ensure all relative paths are correct after deployment
- **Routing Issues**: React Router is configured for browser history, which works with GitHub Pages when properly configured

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint

## Contributing

Feel free to submit issues and enhancement requests!
