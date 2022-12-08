import { render } from '@testing-library/react';

import Try from '@/pages/try';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Index page', () => {
  describe('Render method', () => {
    it('Test page renders without error', () => {
      render(<Try />);

      expect(true).toBeTruthy();
    });
  });
});
