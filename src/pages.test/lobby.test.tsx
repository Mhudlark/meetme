import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import Lobby from '@/pages/lobby';
import store from '@/store/store';

// The easiest solution to mock `next/router`: https://github.com/vercel/next.js/issues/7479
// The mock has been moved to `__mocks__` folder to avoid duplication

describe('Lobby page', () => {
  describe('Render method', () => {
    it('Test page renders without error', () => {
      render(
        <Provider store={store}>
          <Lobby />
        </Provider>
      );

      expect(true).toBeTruthy();
    });
  });
});
