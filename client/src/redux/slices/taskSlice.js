import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await taskService.getAll(params);
      return res.tasks;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentTask: (state, action) => {
      state.current = action.payload;
    },
    addTask: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateTaskInList: (state, action) => {
      const idx = state.list.findIndex((t) => t._id === action.payload._id);
      if (idx > -1) state.list[idx] = action.payload;
    },
    removeTask: (state, action) => {
      state.list = state.list.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTask, addTask, updateTaskInList, removeTask } =
  taskSlice.actions;
export default taskSlice.reducer;