import reducer, { setAds, setCurrentAd, setLoading, setError, clearError } from './adsSlice';

describe('adsSlice reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      ads: [],
      currentAd: null,
      loading: false,
      error: null,
    });
  });

  it('should set ads and current ad', () => {
    const ads = [1, 2];
    let state = reducer(undefined, setAds(ads));
    expect(state.ads).toEqual(ads);
    state = reducer(state, setCurrentAd(2));
    expect(state.currentAd).toBe(2);
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
