import { test, expect } from '@playwright/test';
import { authenticated, mockApi } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await authenticated(page);
  await mockApi(page);
});

test('CT-E2E-08 | HU-08: filtra los lugares turísticos por ciudad', async ({ page }) => {
  await page.goto('/lugares-turisticos');
  await expect(page.getByRole('heading', { name: 'Lugares Turísticos' })).toBeVisible();
  await expect(page.locator('.lugar-card')).toHaveCount(3);
  await page.getByLabel('Buscar ciudad').fill('Guayaquil');
  await expect(page.locator('.lugar-card')).toHaveCount(2);
  await expect(page.getByText('Mitad del Mundo')).toHaveCount(0);
  await expect(page.getByText('Malecón 2000')).toBeVisible();
});

test('CT-E2E-09 | HU-08: consulta hoteles y atractivos de un destino', async ({ page }) => {
  await page.goto('/destino?ciudad=Guayaquil');
  await expect(page.getByRole('heading', { name: 'Destino: Guayaquil' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hotel Centro' })).toBeVisible();
  await page.getByRole('button', { name: /Lugares Turísticos \(2\)/ }).click();
  await expect(page.getByRole('heading', { name: 'Malecón 2000' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Parque Histórico' })).toBeVisible();
});

test('CT-E2E-10 | HU-09: presenta recomendaciones con puntuación y reseñas', async ({ page }) => {
  await page.goto('/recomendados?ciudad=Guayaquil');
  await expect(page.getByRole('heading', { name: 'Recomendados para ti en Guayaquil' })).toBeVisible();
  await expect(page.locator('.recomendado-card')).toHaveCount(2);
  await expect(page.locator('.recomendado-card').first()).toContainText('Malecón 2000');
  await expect(page.locator('.recomendado-card').first()).toContainText('4.70');
  await expect(page.locator('.recomendado-card').first()).toContainText('12');
});

test('CT-E2E-11 | HU-10: envía una calificación desde la ficha turística', async ({ page }) => {
  const { calls } = await mockApi(page);
  await page.goto('/destino?ciudad=Guayaquil');
  await page.getByRole('button', { name: /Lugares Turísticos \(2\)/ }).click();
  const card = page.locator('.item-card').filter({ hasText: 'Malecón 2000' });
  await card.getByRole('button', { name: 'Calificar y Recomendar' }).click();
  await expect(page.getByRole('heading', { name: 'Calificar: Malecón 2000' })).toBeVisible();
  await page.getByText('Calificación (1-5 estrellas)').locator('..').locator('select').selectOption('5');
  await page.getByPlaceholder('Escribe tu recomendación...').fill('Muy agradable para visitar');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect.poll(() => calls.filter(c => c.method === 'POST' && c.path === '/calificaciones').length).toBe(1);
  const request = calls.find(c => c.method === 'POST' && c.path === '/calificaciones');
  expect(request.body).toMatchObject({ tipo: 'lugarTuristico', calificacion: 5 });
  expect(request.body.referencia).toBe('507f191e810c19729de860aa');
});
