// src/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { IUser } from '@/types/post';

/**
 * Types
 */

export type FollowPreview = {
  id: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  followedAt?: string | Date | null;
};

/**
 * Async thunks
 */

export const fetchUserByUsername = createAsyncThunk<
  IUser,
  { username: string, token: string | null },
  { rejectValue: string }
>('user/fetchByUsername', async ({username, token}, thunkAPI) => {
  try {
    const response = await api.get(`/user/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }});
    console.log("fetchUserByUsername response: ", response);

    return response.data.user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
    return thunkAPI.rejectWithValue('Failed to fetch user');
  }
});

export const fetchFollowers = createAsyncThunk<
  FollowPreview[],
  { userId: string; limit?: number; token: string },
  { rejectValue: string }
>('user/fetchFollowers', async ({ userId, limit = 50, token }, thunkAPI) => {
  try {
    const response = await api.get(`/${userId}/followers`, { params: { limit }, headers: {
          Authorization: `Bearer ${token}`
        }});
      console.log("fetchFollowers response: ", response.data);
    return response.data.followers;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch followers');
    }
    return thunkAPI.rejectWithValue('Failed to fetch followers');
  }
});

export const fetchFollowing = createAsyncThunk<
  FollowPreview[],
  { userId: string; limit?: number; token: string },
  { rejectValue: string }
>('user/fetchFollowing', async ({ userId, limit = 50, token }, thunkAPI) => {
  try {
    const response = await api.get(`/${userId}/following`, { params: { limit }, headers: {
          Authorization: `Bearer ${token}`
        }});
    return response.data.following;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch following');
    }
    return thunkAPI.rejectWithValue('Failed to fetch following');
  }
});

// export const updateProfile = createAsyncThunk<
//   User,
//   Partial<Pick<User, 'displayName' | 'bio' | 'avatarUrl'>>,
//   { rejectValue: string }
// >('user/updateProfile', async (data, thunkAPI) => {
//   try {
//     const resp = await api.put('/api/users/me', data);
//     const payload = unwrapData<User>(resp);
//     return payload;
//   } catch (err) {
//     const e = err as AxiosError;
//     const msg = e.response?.data?.error ?? e.message ?? 'Failed to update profile';
//     return thunkAPI.rejectWithValue(String(msg));
//   }
// });

export const followUser = createAsyncThunk<
  { followeeId: string },
  {userId: string, targetUserId: string, token: string},
  { rejectValue: string }
>('user/followUser', async ({userId, targetUserId, token}, thunkAPI) => {
  try {
    await api.post(`/${targetUserId}/follow`, { userId, headers: {
          Authorization: `Bearer ${token}`
        }});
    return { followeeId: targetUserId };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to follow user');
    }
    return thunkAPI.rejectWithValue('Failed to follow user');
  }
});

// export const unfollowUser = createAsyncThunk<
//   { ok: boolean; followeeId: string },
//   string,
//   { rejectValue: string }
// >('user/unfollowUser', async (targetUserId, thunkAPI) => {
//   try {
//     await api.delete(`/api/users/${encodeURIComponent(targetUserId)}/follow`);
//     return { ok: true, followeeId: targetUserId };
//   } catch (err) {
//     const e = err as AxiosError;
//     const msg = e.response?.data?.error ?? e.message ?? 'Failed to unfollow user';
//     return thunkAPI.rejectWithValue(String(msg));
//   }
// });

/**
 * Slice state
 */
type UserState = {
  profile: IUser | null;
  followers: FollowPreview[];
  following: FollowPreview[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  followersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  followingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: UserState = {
  profile: null,
  followers: [],
  following: [],
  status: 'idle',
  error: null,
  followersStatus: 'idle',
  followingStatus: 'idle'
};

/**
 * Slice
 */
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<IUser>) {
      state.profile = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
      state.followers = [];
      state.following = [];
      state.status = 'idle';
      state.error = null;
      state.followersStatus = 'idle';
      state.followingStatus = 'idle';
    },
    addFollowerPreview(state, action: PayloadAction<FollowPreview>) {
      state.followers.unshift(action.payload);
      state.profile && (state.profile.followersCount = (state.profile.followersCount || 0) + 1);
    },
    removeFollowerPreview(state, action: PayloadAction<string>) {
      state.followers = state.followers.filter((f) => String(f.id) !== String(action.payload));
      state.profile && (state.profile.followersCount = Math.max(0, (state.profile.followersCount || 1) - 1));
    }
  },
  extraReducers(builder) {
    builder
      // fetchUserByUsername
      .addCase(fetchUserByUsername.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load user';
      })

      // fetchFollowers
      .addCase(fetchFollowers.pending, (state) => {
        state.followersStatus = 'loading';
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followersStatus = 'succeeded';
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state) => {
        state.followersStatus = 'failed';
      })

      // fetchFollowing
      .addCase(fetchFollowing.pending, (state) => {
        state.followingStatus = 'loading';
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.followingStatus = 'succeeded';
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state) => {
        state.followingStatus = 'failed';
      })

      // updateProfile
    //   .addCase(updateProfile.pending, (state) => {
    //     state.status = 'loading';
    //   })
    //   .addCase(updateProfile.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.profile = action.payload;
    //   })
    //   .addCase(updateProfile.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload ?? 'Failed to update profile';
    //   })

      // followUser
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.profile && String(state.profile.id) === String(action.payload.followeeId)) {
          state.profile.followersCount = (state.profile.followersCount || 0) + 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        // optionally set error
        state.error = action.payload ?? state.error;
      })

      // unfollowUser
    //   .addCase(unfollowUser.fulfilled, (state, action) => {
    //     if (state.profile && String(state.profile._id) === String(action.payload.followeeId)) {
    //       state.profile.followersCount = Math.max(0, (state.profile.followersCount || 1) - 1);
    //     }
    //   })
    //   .addCase(unfollowUser.rejected, (state, action) => {
    //     state.error = action.payload ?? state.error;
    //   });
  }
});

/**
 * Exports
 */
export const userActions = slice.actions;

export default slice.reducer;

/**
 * Selectors (usage: selectProfile(state))
 */
export const selectProfile = (state: { user: UserState }) => state.user.profile;
export const selectFollowers = (state: { user: UserState }) => state.user.followers;
export const selectFollowing = (state: { user: UserState }) => state.user.following;
export const selectUserStatus = (state: { user: UserState }) => state.user.status;
