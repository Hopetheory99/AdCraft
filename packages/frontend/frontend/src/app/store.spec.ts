import { store } from './store';

// Checking initial state of store

describe('store initialization', () => {
  it('should create a store without the example slice', () => {
    const state = store.getState();
    expect(state).not.toHaveProperty('example');
  });
});
