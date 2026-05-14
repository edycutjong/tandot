import { formatMXN, formatMXNB, timeAgo, trustLabel, FREQUENCY_LABELS, STATUS_LABELS } from '../constants';

describe('Constants and Formatting Utilities', () => {
  describe('formatMXN', () => {
    it('formats positive numbers correctly', () => {
      const result = formatMXN(1000);
      expect(result).toMatch(/1,000(\.00)?/);
      expect(result).toContain('$');
    });

    it('formats zero correctly', () => {
      const result = formatMXN(0);
      expect(result).toMatch(/0(\.00)?/);
      expect(result).toContain('$');
    });
  });

  describe('formatMXNB', () => {
    it('appends MXNB correctly', () => {
      expect(formatMXNB(500)).toContain('500');
      expect(formatMXNB(500)).toContain('MXNB');
    });
  });

  describe('trustLabel', () => {
    it('returns Excelente for scores >= 80', () => {
      expect(trustLabel(85).text).toBe('Excelente');
      expect(trustLabel(100).text).toBe('Excelente');
      expect(trustLabel(80).text).toBe('Excelente');
    });

    it('returns Bueno for scores between 60 and 79', () => {
      expect(trustLabel(79).text).toBe('Bueno');
      expect(trustLabel(60).text).toBe('Bueno');
    });

    it('returns Regular for scores between 40 and 59', () => {
      expect(trustLabel(59).text).toBe('Regular');
      expect(trustLabel(40).text).toBe('Regular');
    });

    it('returns Riesgoso for scores < 40', () => {
      expect(trustLabel(39).text).toBe('Riesgoso');
      expect(trustLabel(0).text).toBe('Riesgoso');
    });
  });

  describe('timeAgo', () => {
    it('returns hace un momento for < 60s', () => {
      const date = new Date(Date.now() - 30 * 1000).toISOString();
      expect(timeAgo(date)).toBe('hace un momento');
    });

    it('returns minutes for < 1h', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(timeAgo(date)).toBe('hace 5m');
    });

    it('returns hours for < 24h', () => {
      const date = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      expect(timeAgo(date)).toBe('hace 3h');
    });

    it('returns days for >= 24h', () => {
      const date = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
      expect(timeAgo(date)).toBe('hace 2d');
    });
  });

  describe('Dictionaries', () => {
    it('has correct FREQUENCY_LABELS', () => {
      expect(FREQUENCY_LABELS.weekly).toBe('Semanal');
      expect(FREQUENCY_LABELS.biweekly).toBe('Quincenal');
      expect(FREQUENCY_LABELS.monthly).toBe('Mensual');
    });

    it('has correct STATUS_LABELS', () => {
      expect(STATUS_LABELS.forming).toBe('Formándose');
      expect(STATUS_LABELS.active).toBe('Activa');
    });
  });
});
