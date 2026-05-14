import React from 'react';
import { render } from '@testing-library/react';
import { TrustRing } from '../TrustRing';

describe('TrustRing', () => {
  it('renders correctly and assigns color classes based on score', () => {
    const { container, rerender } = render(<TrustRing score={90} />);
    expect(container.innerHTML).toContain('stroke-(--emerald-400)');

    rerender(<TrustRing score={70} />);
    expect(container.innerHTML).toContain('stroke-(--amber-500)');

    rerender(<TrustRing score={40} />);
    expect(container.innerHTML).toContain('stroke-(--red-500)');
  });
});
