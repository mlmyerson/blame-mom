# blame-mom

A static React + Vite site deployed to GitHub Pages.

## 🚀 Live Site

The site is automatically deployed to GitHub Pages at: [https://mlmyerson.github.io/blame-mom/](https://mlmyerson.github.io/blame-mom/)

## 🛠️ Development

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mlmyerson/blame-mom.git
   cd blame-mom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173/`

### Building

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 📦 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by a GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Manual Deployment

You can also manually trigger a deployment from the GitHub Actions tab.

## 🧰 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD
