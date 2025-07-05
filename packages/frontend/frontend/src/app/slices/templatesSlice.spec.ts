import reducer, { setTemplates, setLoading, setError, clearError } from './templatesSlice';

describe('templatesSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      templates: [],
      loading: false,
      error: null,
    });
  });

  it('should set templates', () => {
    const state = reducer(undefined, setTemplates([1]));
    expect(state.templates).toEqual([1]);
  });

  it('should handle loading', () => {
    const state = reducer(undefined, setLoading(true));
    expect(state.loading).toBe(true);
  });

  it('should set and clear error', () => {
    let state = reducer(undefined, setError('err'));
    expect(state.error).toBe('err');
    state = reducer(state, clearError());
    expect(state.error).toBeNull();
  });
});
