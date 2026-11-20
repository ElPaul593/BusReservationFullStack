import { test, expect } from '@playwright/test';
import { mockApi, ROUTES } from './fixtures.js';

test('CT-E2E-01 | HU-02: la pantalla inicial permite abrir el login', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: /por qué elegirnos/i })).toBeVisible();
  await page.getByRole('link', { name: 'Iniciar Sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
});

test('CT-E2E-02 | HU-02: rechaza credenciales incorrectas sin autenticar', async ({ page }) => {
  const { calls } = await mockApi(page, { loginStatus: 401 });
  await page.goto('/login');
  await page.locator('#identificacion').fill('0999999999');
  await page.locator('#password').fill('invalida123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Credenciales incorrectas')).toBeVisible();
  expect(calls.some(call => call.path === '/auth/login' && call.method === 'POST')).toBeTruthy();
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});

test('CT-E2E-03 | HU-02: permite autenticarse con respuesta válida del backend simulado', async ({ page }) => {
  const { calls } = await mockApi(page);
  await page.goto('/login');
  await page.locator('#identificacion').fill('0999999999');
  await page.locator('#password').fill('contrasena-de-prueba');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token'))).not.toBeNull();
  await expect.poll(() => calls.some(c => c.path === '/auth/login' && c.method === 'POST')).toBeTruthy();
  // El usuario no-administrador puede ser enviado a /demo desde /dashboard:
  // verificamos el inicio de sesión sin asumir acceso administrativo.
  await page.goto('/boletos');
  await expect(page.getByRole('heading', { name: 'Boletos Disponibles' })).toBeVisible();
  await expect(page.locator('.boleto-card').first()).toContainText(ROUTES[0].from);
});

test('CT-E2E-04 | HU-02: una ruta privada redirige al login sin token', async ({ page }) => {
  await page.goto('/boletos');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
});
