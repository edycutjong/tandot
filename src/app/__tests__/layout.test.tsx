import { render } from '@testing-library/react';
import RootLayout from '../layout';

describe('RootLayout', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress DOM nesting warnings for RootLayout tests as it naturally includes <html>/<body>
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('cannot be a child of')) {
        return;
      }
      // Log other errors normally if they occur
      console.log('Suppressed console.error in test:', message);
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    expect(getByText('Test Child Content')).toBeInTheDocument();
  });
});

