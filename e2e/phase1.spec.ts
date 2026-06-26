import { test, expect } from '@playwright/test';

const SEED_TRIP_ID = 'seed-trip-summer-tokyo';

test.describe('E2E-01 Invite flow', () => {
  test.skip(!process.env.E2E_AUTH_READY, 'Requires authenticated session setup');

  test('trip dashboard is reachable for members', async ({ page }) => {
    await page.goto(`/trips/${SEED_TRIP_ID}/dashboard`);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});

test.describe('E2E-02 Itinerary conflict', () => {
  test.skip(!process.env.E2E_AUTH_READY, 'Requires authenticated session setup');

  test('shows conflict badge for overlapping activities', async ({ page }) => {
    await page.goto(`/trips/${SEED_TRIP_ID}/itinerary`);
    await expect(page.getByText('Time conflict').first()).toBeVisible();
  });
});

test.describe('E2E-03 Group decision', () => {
  test.skip(!process.env.E2E_AUTH_READY, 'Requires authenticated session setup');

  test('poll UI is visible on group hub', async ({ page }) => {
    await page.goto(`/trips/${SEED_TRIP_ID}/group-hub`);
    await expect(page.getByText('Which area for dinner on Day 1?')).toBeVisible();
  });
});

test.describe('E2E-04 Budget split', () => {
  test.skip(!process.env.E2E_AUTH_READY, 'Requires authenticated session setup');

  test('budget summary shows seeded expenses', async ({ page }) => {
    await page.goto(`/trips/${SEED_TRIP_ID}/budget`);
    await expect(page.getByText('Airport train passes')).toBeVisible();
    await expect(page.getByText('Balances')).toBeVisible();
  });
});

test('login page loads for unauthenticated visitors', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /TripSync|Sign in/i })).toBeVisible();
});
