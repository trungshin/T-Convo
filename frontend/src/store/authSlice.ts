// /store/auth.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = { id: string; username: string; displayName?: string; avatarUrl?: string };
type AuthState = { user: User | null; accessToken: string | null; loading: boolean };

const initialState: AuthState = { user: null, accessToken: null, loading: false };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) { state.user = action.payload; },
    setAccessToken(state, action: PayloadAction<string | null>) { state.accessToken = action.payload; },
    logout(state) { state.user = null; state.accessToken = null; },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; }
  }
});

export const authActions = slice.actions;
export default slice.reducer;
