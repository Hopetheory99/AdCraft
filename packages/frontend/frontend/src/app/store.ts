import { configureStore } from '@reduxjs/toolkit';

import adsReducer from './slices/adsSlice';
import assetsReducer from './slices/assetsSlice';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import templatesReducer from './slices/templatesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ads: adsReducer,
    templates: templatesReducer,
    assets: assetsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
