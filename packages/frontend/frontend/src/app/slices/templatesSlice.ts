import { createSlice } from '@reduxjs/toolkit';

interface TemplatesState {
  templates: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TemplatesState = {
  templates: [],
  loading: false,
  error: null,
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates(state, action) {
      state.templates = action.payload;
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

export const { setTemplates, setLoading, setError, clearError } = templatesSlice.actions;
export default templatesSlice.reducer;
