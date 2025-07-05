import reducer, { setProjects, setLoading, setError, clearError } from './projectsSlice';

describe('projectsSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      projects: [],
      loading: false,
      error: null,
    });
  });

  it('should set projects', () => {
    const state = reducer(undefined, setProjects([1]));
    expect(state.projects).toEqual([1]);
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
