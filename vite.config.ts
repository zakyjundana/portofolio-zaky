import { defineConfig } from 'vite';

// Automatically detect GitHub Pages repository name for base path
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

export default defineConfig({
  base: isGithubActions ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        ac_admin: './ac-admin.html',
        vibeshot: './vibeshot.html',
        crevibehub: './crevibehub.html'
      }
    }
  }
});
