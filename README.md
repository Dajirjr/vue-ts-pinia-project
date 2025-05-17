# Vue 3 + TypeScript + Pinia Starter

A fast and scalable frontend boilerplate using Vue 3, TypeScript, Pinia, Vitest, and Vite — ready for enterprise use.

## Features

- 🚀 **Vue 3** with Composition API and `<script setup>`
- 📝 **TypeScript** for type safety
- 🏪 **Pinia** for state management
- ⚡ **Vite** for fast development and building
- 🧪 **Vitest** for unit testing
- 🔄 **GitHub Actions** CI pipeline
- 📦 **Vercel** and **Azure** deployment ready
- 🤖 **Cursor AI** prompt templates for rapid development

## 🚀 Live Demo

👉 [Open App on Azure](https://gray-water-02651941e.6.azurestaticapps.net)

> Built with Vue 3 + TypeScript + Pinia. CI/CD via Azure Static Web Apps.

## Demo & Deploy

🌐 **Live Demo:** [https://vue-ts-pinia-project.vercel.app](https://vue-ts-pinia-project.vercel.app)

Deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dajirjr/vue-ts-pinia-project)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Dajirjr/vue-ts-pinia-project.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run unit tests
npm run type-check # Run TypeScript checks
```

## Project Structure

```
├── .github/          # GitHub Actions workflows
│   └── workflows/    # CI/CD pipeline configurations
├── deployment/       # Deployment guides
│   ├── vercel-deploy.md
│   └── azure-deploy.md
├── prompts/         # Cursor AI templates
│   └── cursor-ai-prompts.md
├── public/          # Static assets
│   ├── favicon.ico
│   └── robots.txt
├── src/             # Source code
│   ├── assets/      # Asset files
│   │   ├── styles/  # Global styles
│   │   ├── images/  # Image files
│   │   └── icons/   # Icon files
│   ├── components/  # Reusable components
│   │   ├── common/  # Shared components
│   │   ├── forms/   # Form-related components
│   │   └── layout/  # Layout components
│   ├── composables/ # Vue composables
│   ├── layouts/     # Layout templates
│   ├── router/      # Vue Router setup
│   ├── stores/      # Pinia stores
│   ├── types/       # TypeScript types
│   ├── utils/       # Utility functions
│   ├── App.vue      # Root component
│   ├── main.ts      # Entry point
│   └── env.d.ts     # Environment variables types
├── test/            # Test files
│   ├── components/  # Component tests
│   ├── stores/      # Store tests
│   └── utils/       # Utility tests
├── .gitignore       # Git ignore rules
├── .gitmessage      # Git commit template
├── index.html       # HTML entry point
├── package.json     # Project dependencies
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite configuration
├── vitest.config.ts # Vitest configuration
├── README.md        # Project documentation
├── CONTRIBUTING.md  # Contributing guidelines
└── LICENSE         # License information
```

## Development Guide

### State Management

The project uses Pinia for state management. Example store usage:

```typescript
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
counter.increment()
console.log(counter.count)
```

### Testing

Tests are written using Vitest. Example test:

```typescript
import { describe, it, expect } from 'vitest'
import { useCounterStore } from '../src/stores/counter'

describe('Counter Store', () => {
  it('increments count', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.count).toBe(1)
  })
})
```

### Type Safety

TypeScript is configured for optimal type safety. Example component:

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

defineProps<Props>()
</script>
```

## Deployment

### Vercel Deployment

See [Vercel Deployment Guide](deployment/vercel-deploy.md)

### Azure Deployment

See [Azure Deployment Guide](deployment/azure-deploy.md)

## AI-Assisted Development

This project includes Cursor AI prompt templates for common development tasks:

- Component creation
- Store implementation
- Test writing
- API integration
- Accessibility checks
- Code reviews

See [Cursor AI Templates](prompts/cursor-ai-prompts.md)

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

## Best Practices

- Use TypeScript for all new code
- Write tests for new features
- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Keep components small and focused
- Follow accessibility guidelines

## Performance Optimization

- Code splitting with dynamic imports
- Tree-shaking unused code
- Asset optimization
- Lazy loading routes
- Caching strategies

## Security

- Regular dependency updates
- Input sanitization
- XSS prevention
- CSRF protection
- Secure authentication patterns

## License

MIT License - see [LICENSE](LICENSE) for details