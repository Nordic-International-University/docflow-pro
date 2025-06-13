// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import ABOUTReducer from '../features/ABOUT/store/ABOUT.slice';
import usersReducer from '../features/users/store/users.slice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    ABOUT: ABOUTReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
