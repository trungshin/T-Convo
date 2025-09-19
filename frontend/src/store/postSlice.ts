// /store/postSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IPost } from '@/types/post';
import api from '@/lib/api';
import axios from 'axios';

export type FeedType = 'home' | 'following';
type PostState = { posts: IPost[]; feed: FeedType; token: string; isLoading: boolean; error?: string | null; };

const initialState: PostState = { posts: [], feed: 'home', token: '', isLoading: false, error: null };

// NEW: Async thunk cho create post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ newPost, token }: { newPost: Omit<IPost, '_id'>, token: string }, { rejectWithValue }) => {
    console.log("New Post: ", newPost);
    try {
      const response = await api.post('/post', newPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      return response.data as IPost; 
    } catch (error: unknown) {
      console.error('Create post error:', error); // Log chi tiết để debug
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch posts');
      }
      return rejectWithValue('Failed to create post');
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (token: string, { rejectWithValue }) => { // Sử dụng rejectWithValue để trả về error tùy chỉnh
    console.log("Token: ", token);
    try {
      // const response = await api.get(`/api/posts?feed=${feed}`);
      const response = await api.get('/post', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched posts:', response);
      return response.data.posts.posts as IPost[]; // Axios tự parse JSON, trả về data trực tiếp
    } catch (error: unknown) {
      console.error('Fetch posts error:', error); // Log chi tiết để debug
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch posts');
      }
      return rejectWithValue('Failed to fetch posts');
    }
  }
);

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<IPost[]>) { state.posts = action.payload; },
    setFeed(state, action: PayloadAction<FeedType>) { state.feed = action.payload; },
    setLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload; }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchPosts.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchPosts.fulfilled, (state, { payload }) => {
          state.isLoading = false;
          state.posts = payload;
        })
        .addCase(fetchPosts.rejected, (state, { payload }) => {
          state.isLoading = false;
          state.error = payload as string;
        });

      builder
        .addCase(createPost.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(createPost.fulfilled, (state, { payload }) => {
          state.posts.unshift(payload); // Thêm post mới vào đầu mảng (hoặc push vào cuối)
          state.isLoading = false;
        })
        .addCase(createPost.rejected, (state, { payload }) => {
          state.isLoading = false;
          state.error = payload as string;
        });
    }
});

export const postActions = slice.actions;
export default slice.reducer;
