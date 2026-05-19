import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
  },
});