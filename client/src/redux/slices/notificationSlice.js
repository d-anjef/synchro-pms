import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    markRead: (state, action) => {
      const note = state.list.find((n) => n._id === action.payload);
      if (note && !note.isRead) {
        note.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.list.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.list = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    });
  },
});

export const { addNotification, markRead, markAllRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;