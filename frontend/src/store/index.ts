// /store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import postsReducer from '@/store/postSlice';
// import postsReducer from './posts.slice';
// import notificationsReducer from './notifications.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    // notifications: notificationsReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
