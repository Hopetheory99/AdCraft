import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Template {
  id: string;
  name: string;
  html: string;
}

interface TemplatesState {
  templates: Template[];
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
    setTemplates(state, action: PayloadAction<Template[]>) {
      state.templates = action.payload;
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

export const { setTemplates, setLoading, setError, clearError } = templatesSlice.actions;
export default templatesSlice.reducer;
