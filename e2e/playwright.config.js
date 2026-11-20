import { defineConfig, devices } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.E2E_PORT || 5173);
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`;
const isLive = process.env.E2E_MODE === 'live';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 12_000 },
  fullyParallel: !isLive,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  // En modo simulado apuntamos las APIs al mismo Vite y Playwright responde
  // las peticiones con fixtures. En modo live se usa el backend REAL indicado.
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    cwd: resolve(here, '../frontend'),
    env: {
      VITE_API_URL: isLive
        ? (process.env.E2E_API_URL || 'http://127.0.0.1:5000/api')
        : `${baseURL}/api`,
      VITE_SEAT_API_URL: isLive
        ? (process.env.E2E_SEAT_API_URL || 'http://127.0.0.1:5000/api/asientos')
        : `${baseURL}/api/asientos`
    },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000
  }
});
