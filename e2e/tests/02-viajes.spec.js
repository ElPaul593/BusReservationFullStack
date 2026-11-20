import { test, expect } from '@playwright/test';
import { authenticated, mockApi, ROUTES } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await authenticated(page);
  await mockApi(page);
});

test('CT-E2E-05 | HU-06: lista rutas y permite filtrar por origen y destino', async ({ page }) => {
  await page.goto('/boletos');
  await expect(page.getByRole('heading', { name: 'Boletos Disponibles' })).toBeVisible();
  await expect(page.locator('.boleto-card')).toHaveCount(2);
  await page.locator('.filter-group').filter({ hasText: 'Origen' }).locator('select').selectOption('Quito');
  await page.locator('.filter-group').filter({ hasText: 'Destino' }).locator('select').selectOption('Guayaquil');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.locator('.boleto-card')).toHaveCount(1);
  await expect(page.locator('.boleto-card')).toContainText(ROUTES[0].from);
  await expect(page.locator('.boleto-card')).toContainText(ROUTES[0].to);
});

test('CT-E2E-06 | HU-07: muestra detalles del viaje seleccionado', async ({ page }) => {
  await page.goto('/boletos');
  const card = page.locator('.boleto-card').filter({ has: page.locator('.origen', { hasText: 'Quito' }) });
  await expect(card).toContainText('Guayaquil');
  await expect(card).toContainText('$15');
  await expect(card).toContainText('8 horas');
  await expect(card.getByRole('link', { name: 'Ver Hoteles y Lugares' })).toHaveAttribute('href', /\/destino\?ciudad=Guayaquil/);
  await expect(card.getByRole('link', { name: 'Ver Recomendados' })).toHaveAttribute('href', /\/recomendados\?ciudad=Guayaquil/);
});

test('CT-E2E-07 | HU-06: consulta rutas recomendadas por provincia', async ({ page }) => {
  await page.goto('/rutas');
  await expect(page.getByRole('heading', { name: 'Rutas Recomendadas' })).toBeVisible();
  await page.locator('#provincia-select').selectOption('Pichincha');
  await expect(page.getByText('Rutas desde Pichincha')).toBeVisible();
  await expect(page.locator('.ruta-card')).toHaveCount(1);
  await expect(page.locator('.ruta-card')).toContainText('Quito');
  await expect(page.locator('.ruta-card')).toContainText('Guayaquil');
});
