import {
  MOCK_STATS,
  MOCK_TANDAS,
  MOCK_MEMBERS,
  MOCK_CONTRIBUTIONS,
  MOCK_PAYOUTS,
} from '../mock-data';

describe('Mock Data', () => {
  it('exports MOCK_STATS', () => {
    expect(MOCK_STATS).toBeDefined();
    expect(MOCK_STATS.total_tandas).toBe(47);
  });

  it('exports MOCK_TANDAS', () => {
    expect(MOCK_TANDAS).toBeDefined();
    expect(MOCK_TANDAS.length).toBeGreaterThan(0);
  });

  it('exports MOCK_MEMBERS', () => {
    expect(MOCK_MEMBERS).toBeDefined();
    expect(MOCK_MEMBERS.length).toBeGreaterThan(0);
  });

  it('exports MOCK_CONTRIBUTIONS', () => {
    expect(MOCK_CONTRIBUTIONS).toBeDefined();
    expect(MOCK_CONTRIBUTIONS.length).toBeGreaterThan(0);
  });

  it('exports MOCK_PAYOUTS', () => {
    expect(MOCK_PAYOUTS).toBeDefined();
    expect(MOCK_PAYOUTS.length).toBeGreaterThan(0);
  });
});
