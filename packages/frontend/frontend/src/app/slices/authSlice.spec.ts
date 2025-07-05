import reducer, { setUser, clearUser, setLoading, setError, clearError } from './authSlice';

describe('authSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      tokens: null,
      loading: false,
      error: null,
    });
  });

  it('should set and clear user', () => {
    let state = reducer(undefined, setUser('test'));
    expect(state.user).toBe('test');
    state = reducer(state, clearUser());
    expect(state.user).toBeNull();
  });

  it('should handle loading', () => {
    const state = reducer(undefined, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('should set and clear error', () => {
    let state = reducer(undefined, setError('oops'));
    expect(state.error).toBe('oops');
    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });
});
