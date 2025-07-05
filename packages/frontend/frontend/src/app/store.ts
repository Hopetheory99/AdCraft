import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

import adsReducer from './slices/adsSlice';
import assetsReducer from './slices/assetsSlice';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import templatesReducer from './slices/templatesSlice';

interface ExampleState {
  value: number;
}

const initialExampleState: ExampleState = {
  value: 0,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState: initialExampleState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = exampleSlice.actions;

export const store = configureStore({
  reducer: {
    example: exampleSlice.reducer,
    auth: authReducer,
    ads: adsReducer,
    templates: templatesReducer,
    assets: assetsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
