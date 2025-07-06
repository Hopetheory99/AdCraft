import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import Register from './Register';
import { store } from '../store';

describe('Register page', () => {
  it('should render name, email and password fields', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <Register />
      </Provider>,
    );
    expect(getByLabelText(/name/i)).toBeTruthy();
    expect(getByLabelText(/email/i)).toBeTruthy();
    expect(getByLabelText(/password/i)).toBeTruthy();
  });
});
