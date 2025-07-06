import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import Login from './Login';
import { store } from '../store';

describe('Login page', () => {
  it('should render email and password fields', () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
    expect(getByLabelText(/email/i)).toBeTruthy();
    expect(getByLabelText(/password/i)).toBeTruthy();
  });
});
