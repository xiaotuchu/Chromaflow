import { expect, it } from 'vitest';
import { routes } from '@/routes';
import History from '@/pages/History';
import { HISTORY_KEY } from '@/storage/practiceStorage';
import { LOCALE_STORAGE_KEY } from '@/i18n/LocaleProvider';

it('keeps the history route and browser storage keys stable after source reorganization', () => {
  expect(History).toBeTypeOf('function');
  expect(routes.profile).toBe('/profile');
  expect(HISTORY_KEY).toBe('chromaflow2.history.v1');
  expect(LOCALE_STORAGE_KEY).toBe('chromaflow2.locale');
});
