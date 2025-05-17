# Vue 3 + TypeScript + Pinia Starter

This project is a lightweight Vue 3 + TypeScript + Pinia frontend boilerplate with:

- ✅ Vite bundler
- ✅ Pinia state management
- ✅ Vitest for unit testing
- ✅ Azure Static Web App CI/CD integration
- ✅ GitHub Actions deployment workflow

---

## 🚀 Deployments

[![Azure Static Web Apps CI/CD](https://img.shields.io/badge/Azure%20Deploy-Live-success?logo=microsoftazure&style=flat-square)](https://gray-water-02651941e.6.azurestaticapps.net)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel&style=flat-square)](https://vercel.com/import)

### Live Demos
- [🔵 Live Demo on Azure](https://gray-water-02651941e.6.azurestaticapps.net) - Primary deployment
- [⚫ Deploy on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Dajirjr/vue-ts-pinia-project) - Alternative deployment

> Built with ❤️ using **Vue 3**, **TypeScript**, and **Pinia**  
> Deployed via **Azure Static Web Apps** and **Vercel**

---

## 🛠 Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```
## 📁 Project Structure

```
src/
  ├─ App.vue          # Root Vue component
  ├─ main.ts          # Application entry point
  └─ stores/
      └─ counter.ts   # Pinia store example
.github/
  └─ workflows/
      ├─ ci.yml           # GitHub Actions CI pipeline
      └─ azure-static-web-apps-*.yml  # Azure deployment
test/
  └─ counter.test.ts  # Unit tests
config/
  ├─ vite.config.ts   # Vite bundler configuration
  ├─ vitest.config.ts # Vitest test configuration
  └─ tsconfig.json    # TypeScript configuration
deployment/
  ├─ azure-deploy.md  # Azure deployment guide
  └─ vercel.json      # Vercel configuration
```

## 📚 Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to this project
- [Azure Deployment Guide](deployment/azure-deploy.md) - Deploy to Azure Static Web Apps
- [Vercel Deployment Guide](deployment/vercel-deploy.md) - Alternative deployment with Vercel

## 📝 License

MIT License - see [LICENSE](LICENSE) for details
---

## 🛣️ Planned Features & Roadmap

| Feature                       | Description                          | Status     |
|------------------------------|--------------------------------------|------------|
| 🧪 Add `@testing-library/vue` | Test UI components                   | ⚪ Optional |
| 🌐 Add Vue Router             | Multi-page support                   | ⚪ Optional |
| 🔒 Add Auth                   | Supabase/Firebase login              | ⚪ Optional |
| 📦 Use dynamic `.env`         | For API keys or endpoints            | ⚪ Optional |
| 🧩 Deploy preview builds      | Preview branches in Azure            | ⚪ Optional |
| 🧾 Auto-versioning            | Auto tag releases via GitHub Actions | ⚪ Optional |
