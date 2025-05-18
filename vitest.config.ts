import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__mocks__/*',
        '**/node_modules/**',
        'test/setup.ts'
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    include: [
      'test/**/*.test.ts',
      'test/**/*.spec.ts',
      'src/**/*.test.ts',
      'test/**/*.test.tsx'
    ],
    exclude: ['node_modules', 'dist'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    reporters: ['default', 'html'],
    outputFile: {
      html: './html/test-report.html'
    }
  },
}) 