import { defineConfig, devices } from "@playwright/test";

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",

  /* Timeout por teste */
  timeout: 30 * 1000,

  /* Executar testes em paralelo */
  fullyParallel: true,

  /* Falhar o build no CI se você acidentalmente deixou test.only */
  forbidOnly: !!process.env.CI,

  /* Tentar novamente no CI apenas */
  retries: process.env.CI ? 2 : 0,

  /* Número de workers em paralelo */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [["html"], ["list"]],

  /* Configurações compartilhadas para todos os projetos */
  use: {
    /* URL base para navegação */
    baseURL: "http://localhost:3000",

    /* Capturar screenshot apenas em falhas */
    screenshot: "only-on-failure",

    /* Capturar vídeo apenas em falhas */
    video: "retain-on-failure",

    /* Trace apenas em falhas */
    trace: "on-first-retry",
  },

  /* Configuração dos projetos de teste */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Testes mobile */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  /* Servidor de desenvolvimento */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
