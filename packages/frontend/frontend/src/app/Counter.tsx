import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { increment, decrement } from './store';

import type { RootState, AppDispatch } from './store';

export function Counter() {
  const value = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Counter Example (Redux Toolkit)</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span style={{ fontSize: '1.5rem', minWidth: '2rem', textAlign: 'center' }}>{value}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
}

export default Counter;
