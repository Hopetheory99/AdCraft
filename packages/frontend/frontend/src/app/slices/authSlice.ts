import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login } from '../services/auth.service';

interface User {
  id: number;
  email: string;
}

interface Tokens {
  access_token: string;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await register(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: { payload: User }) {
      state.user = action.payload;
    },
    setTokens(state, action: { payload: Tokens }) {
      state.tokens = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.tokens = null;
    },
    setLoading(state, action: { payload: boolean }) {
      state.loading = action.payload;
    },
    setError(state, action: { payload: string | null }) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tokens = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setTokens, clearUser, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
