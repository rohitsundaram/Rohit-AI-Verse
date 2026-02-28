# Rohit Sundaram - Portfolio Website

A modern portfolio website showcasing AI engineering expertise, services, and projects. Built with React, TypeScript, and Tailwind CSS.


## Why This Project Matters

This repository is the public entry point to my AI engineering work. It highlights production projects, consulting services, and technical depth in a format that is easy for recruiters and clients to evaluate quickly.

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
git clone https://github.com/rohitsundaram/Rohit-AI-Verse.git

# Step 2: Navigate to the project directory
cd Rohit-AI-Verse

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the project root and add:

```sh
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values power the blog + private editor routes:
- `http://localhost:8080/blog`
- `http://localhost:8080/blog/:slug`
- `http://localhost:8080/admin/login`
- `http://localhost:8080/admin/blog`

### Supabase Blog Setup

1. Create a Supabase project.
2. Open the SQL Editor and run [`docs/supabase-blog.sql`](docs/supabase-blog.sql).
3. In Authentication settings, enable magic-link login for your email.
4. Add your project URL + anon key to `.env`.
5. Start the app and sign in at `/admin/login` to create drafts, use the block editor with rich formatting + image upload, preview, and publish.

## 🌐 Live Demo

Portfolio: https://rohitsundaram.com

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

### Build for Production

```sh
npm run build
```

The built files will be in the `dist/` folder.

### Deployment Options

- **AWS (S3 + CloudFront)**: Upload `dist/` folder to S3, configure CloudFront, set up Route 53
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop `dist/` folder or connect repo
- **Other hosting providers**: Upload the `dist/` folder contents to your hosting provider

## 📝 Contact Form

The contact form uses Formspree for email delivery. Configure your Formspree endpoint in `src/components/Contact.tsx`.

## 🤖 Chatbot Features

The chatbot provides intelligent conversations about projects and services using a knowledge base built from GitHub repositories.

### Chatbot Capabilities

- **Project Information:** Answers detailed questions about all projects including architecture, tech stack, and features
- **Service Details:** Explains services offered with technical details
- **Skills & Expertise:** Lists technologies and skills based on project work
- **GitHub Links:** Provides direct links to project repositories
- **Meeting Scheduling:** When unable to answer a question, suggests scheduling a meeting with Rohit and shows a meeting request form
- **Knowledge Base:** Built from GitHub repositories for accurate, up-to-date information

## 📄 License

MIT License. See `LICENSE` for details.