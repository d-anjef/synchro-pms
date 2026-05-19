import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await projectService.getAll(params);
      return res.projects;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.current = action.payload;
    },
    addProject: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateProjectInList: (state, action) => {
      const idx = state.list.findIndex((p) => p._id === action.payload._id);
      if (idx > -1) state.list[idx] = action.payload;
    },
    removeProject: (state, action) => {
      state.list = state.list.filter((p) => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject, addProject, updateProjectInList, removeProject } =
  projectSlice.actions;
export default projectSlice.reducer;