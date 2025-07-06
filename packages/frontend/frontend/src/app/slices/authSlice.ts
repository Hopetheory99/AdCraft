import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { AuthService } from '../services/authService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  teams: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
  lastLogin?: Date;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
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

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      return response.data as { user: User; tokens: Tokens };
    } catch (error: unknown) {
      const err = error as { response?: { data: string } };
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      return response.data as { user: User; tokens: Tokens };
    } catch (error: unknown) {
      const err = error as { response?: { data: string } };
      return rejectWithValue(err.response?.data || 'Registration failed');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await AuthService.logout();
    return null;
  } catch (error: unknown) {
    const err = error as { response?: { data: string } };
    return rejectWithValue(err.response?.data || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          localStorage.setItem('accessToken', action.payload.tokens.accessToken);
          localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.tokens = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
