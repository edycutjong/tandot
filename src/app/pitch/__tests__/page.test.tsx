import { redirect } from 'next/navigation';
import PitchRedirect from '../page';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('PitchRedirect Page', () => {
  it('redirects to /pitch/index.html', () => {
    PitchRedirect();
    expect(redirect).toHaveBeenCalledWith('/pitch/index.html');
  });
});
