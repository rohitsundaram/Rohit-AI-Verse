# Rohit Sundaram - Portfolio Website

A modern portfolio website showcasing AI engineering expertise, services, and projects. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

## 📦 Installation

### Prerequisites

- Node.js 18+ (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn

### Setup

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd rohits-ai-verse

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/      # React components
│   ├── ui/         # shadcn-ui components
│   └── ...         # Feature components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── main.tsx        # Entry point
```

## 🌐 Deployment

### GitHub Pages (Recommended & Free)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup Steps:

1. **Push your code to GitHub**
   ```sh
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Update base path (if needed):**
   - If your repo is `username.github.io`, the base path is automatically set to `/`
   - If your repo is a project repo (e.g., `username/rohits-ai-verse`), the base path is automatically set to `/rohits-ai-verse/`
   - You can update `REPO_NAME` in `vite.config.ts` if your repo name is different

4. **Automatic Deployment:**
   - Every push to the `main` branch will automatically trigger a build and deployment
   - Your site will be available at: `https://username.github.io/repo-name/`

#### Custom Domain (Optional):

To use `rohitsundaram.com`:
1. Add a `CNAME` file in the `public/` folder with your domain: `rohitsundaram.com`
2. Configure DNS records in your domain registrar to point to GitHub Pages
3. Enable the custom domain in GitHub repository settings

### Other Options

- **AWS (S3 + CloudFront)**: Upload `dist/` folder to S3, configure CloudFront, set up Route 53
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop `dist/` folder or connect repo

## 📝 Contact Form

The contact form uses Formspree for email delivery. Configure your Formspree endpoint in `src/components/Contact.tsx`.

## 📄 License

© 2025 Rohit Sundaram. All rights reserved.