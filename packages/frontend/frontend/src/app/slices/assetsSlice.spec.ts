import reducer, { setAssets, setLoading, setError, clearError } from './assetsSlice';

describe('assetsSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      assets: [],
      loading: false,
      error: null,
    });
  });

  it('should set assets', () => {
    const state = reducer(undefined, setAssets([1]));
    expect(state.assets).toEqual([1]);
  });

  it('should handle loading', () => {
    const state = reducer(undefined, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('should set and clear error', () => {
    let state = reducer(undefined, setError('fail'));
    expect(state.error).toBe('fail');
    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });
});
