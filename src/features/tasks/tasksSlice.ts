import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v1 } from "uuid";

export interface TaskType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "done" | "inProgress" | "todo";
}

export interface taskState {
  tasks: TaskType[];
}

const initialState: taskState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<TaskType, "id">>) {
      state.tasks.push({ ...action.payload, id: v1() });
    },

    editTask(state, action: PayloadAction<TaskType>) {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    updateTaskOrder(state, action: PayloadAction<TaskType[]>) {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, editTask, deleteTask, updateTaskOrder } =
  tasksSlice.actions;

export default tasksSlice.reducer;
