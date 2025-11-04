import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("deve carregar a página inicial", async ({ page }) => {
    await page.goto("/");

    // Verificar título
    await expect(page).toHaveTitle(/Dashboard de Finanças Pessoais/);

    // Verificar heading principal
    await expect(
      page.getByRole("heading", { name: /Dashboard de Finanças Pessoais/i })
    ).toBeVisible();
  });

  test("deve mostrar botões de login e cadastro", async ({ page }) => {
    await page.goto("/");

    // Verificar botões
    await expect(page.getByRole("link", { name: /Entrar/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Criar Conta/i })
    ).toBeVisible();
  });

  test("deve mostrar cards de features", async ({ page }) => {
    await page.goto("/");

    // Verificar features
    await expect(page.getByText(/Transações/i)).toBeVisible();
    await expect(page.getByText(/Dashboard/i)).toBeVisible();
    await expect(page.getByText(/Metas/i)).toBeVisible();
  });

  test("deve mostrar tech stack", async ({ page }) => {
    await page.goto("/");

    // Verificar badges de tecnologia
    await expect(page.getByText(/Next.js/i)).toBeVisible();
    await expect(page.getByText(/TypeScript/i)).toBeVisible();
    await expect(page.getByText(/Tailwind CSS/i)).toBeVisible();
  });

  test("deve navegar para página de login", async ({ page }) => {
    await page.goto("/");

    // Clicar no botão de login
    await page.getByRole("link", { name: /Entrar/i }).click();

    // Verificar URL
    await expect(page).toHaveURL(/\/login/);
  });

  test("deve navegar para página de cadastro", async ({ page }) => {
    await page.goto("/");

    // Clicar no botão de cadastro
    await page.getByRole("link", { name: /Criar Conta/i }).click();

    // Verificar URL
    await expect(page).toHaveURL(/\/signup/);
  });
});
