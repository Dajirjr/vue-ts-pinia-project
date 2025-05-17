# Vue 3 + TypeScript + Pinia Starter

This project is a lightweight Vue 3 + TypeScript + Pinia frontend boilerplate with:

- ✅ Vite bundler
- ✅ Pinia state management
- ✅ Vitest for unit testing
- ✅ Azure Static Web App CI/CD integration
- ✅ GitHub Actions deployment workflow

---

## 🚀 Live Demo

👉 [**Open the App**](https://gray-water-02651941e.6.azurestaticapps.net)

> Deployed using **Azure Static Web Apps**  
> Built with ❤️ using **Cursor**, **GitHub**, and **TypeScript**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dajirjr/vue-ts-pinia-project) ![Azure Static Web Apps](https://img.shields.io/azure-static-web-apps/deployment-status/gray-water-02651941e.6?label=Azure%20Deploy&style=flat-square)

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
      └─ ci.yml       # GitHub Actions CI config
test/
  └─ counter.test.ts  # Unit tests
```

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Deployment Guide](deployment/azure-deploy.md)
- [Development Guide](deployment/vercel-deploy.md)

## 📝 License

MIT License - see [LICENSE](LICENSE) for details