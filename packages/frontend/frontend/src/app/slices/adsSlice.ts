import { createSlice } from '@reduxjs/toolkit';

interface AdsState {
  ads: any[];
  currentAd: any;
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  ads: [],
  currentAd: null,
  loading: false,
  error: null,
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setAds(state, action) {
      state.ads = action.payload;
    },
    setCurrentAd(state, action) {
      state.currentAd = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setAds, setCurrentAd, setLoading, setError, clearError } = adsSlice.actions;
export default adsSlice.reducer;
