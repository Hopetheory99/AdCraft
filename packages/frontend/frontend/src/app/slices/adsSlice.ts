import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ad {
  id: string;
  title: string;
  content: string;
}

interface AdsState {
  ads: Ad[];
  currentAd: Ad | null;
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
    setAds(state, action: PayloadAction<Ad[]>) {
      state.ads = action.payload;
    },
    setCurrentAd(state, action: PayloadAction<Ad | null>) {
      state.currentAd = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setAds, setCurrentAd, setLoading, setError, clearError } = adsSlice.actions;
export default adsSlice.reducer;
