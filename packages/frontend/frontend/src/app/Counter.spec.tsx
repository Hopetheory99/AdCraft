import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Counter } from './Counter';
import { store } from './store';

describe('Counter', () => {
  it('should render and increment/decrement value', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Counter />
      </Provider>,
    );
    const plusButton = getByText('+');
    const minusButton = getByText('-');
    const value = getByText('0');

    fireEvent.click(plusButton);
    expect(getByText('1')).toBeTruthy();
    fireEvent.click(minusButton);
    expect(getByText('0')).toBeTruthy();
  });
});
