import { dictionaries } from '../i18n';

describe('i18n Dictionaries', () => {
  it('exports dictionaries for both en and es', () => {
    expect(dictionaries).toBeDefined();
    expect(dictionaries.en).toBeDefined();
    expect(dictionaries.es).toBeDefined();
  });

  it('contains expected keys in en dictionary', () => {
    expect(dictionaries.en.nav_launch).toBe('Launch App');
    expect(dictionaries.en.hero_badge).toBe('ETHEREUM MEXICO 2026');
  });

  it('contains expected keys in es dictionary', () => {
    expect(dictionaries.es.nav_launch).toBe('Iniciar App');
    expect(dictionaries.es.hero_badge).toBe('ETHEREUM MEXICO 2026');
  });
});
