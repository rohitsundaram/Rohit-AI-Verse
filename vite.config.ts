import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Get repository name from package.json or environment
// If deploying to GitHub Pages (not username.github.io), use repo name as base
// For username.github.io repos, use '/' as base
// Update REPO_NAME below if your repo name is different
const REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'rohits-ai-verse';
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPages ? `/${REPO_NAME}/` : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
