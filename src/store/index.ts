import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userManagementReducer from './slices/userManagementSlice';
import yearDataReducer from './slices/yearDataSlice';
import studentReducer from './slices/studentSlice';
import personalSectionReducer from './slices/personalSectionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userManagement: userManagementReducer,
    yearData: yearDataReducer,
    student: studentReducer,
    personalSection : personalSectionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
