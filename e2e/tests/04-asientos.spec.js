import { test, expect } from '@playwright/test';
import { authenticated, mockApi, ROUTES } from './fixtures.js';

test('CT-E2E-12 | HU-11 y HU-12: selecciona asiento y comprueba creación de hold simulado', async ({ page }) => {
  await authenticated(page);
  const { calls } = await mockApi(page);
  await page.goto('/seat-booking');
  await expect(page.getByRole('heading', { name: /Reserva de Asientos/ })).toBeVisible();
  await page.locator('#ruta').selectOption(ROUTES[0]._id);
  const tomorrow = new Date(Date.now() + 48 * 60 * 60_000).toISOString().slice(0, 10);
  await page.locator('#fecha').fill(tomorrow);
  await page.getByRole('button', { name: /Reservar Ahora/ }).click();
  await expect(page.getByRole('heading', { name: 'Selección de Asientos' })).toBeVisible();

  // No confirma la compra ni crea registros reales en MongoDB:
  // se comprueba que el frontend pide un hold al endpoint correcto.
  await page.getByRole('button', { name: '1', exact: true }).click();
  await expect(page.getByText('Asientos seleccionados: [1]')).toBeVisible();
  const hold = calls.find(c => c.method === 'POST' && c.path === '/asientos/reservar');
  expect(hold?.body).toMatchObject({
    rutaId: ROUTES[0]._id, fecha: tomorrow, asiento: 1
  });
});
