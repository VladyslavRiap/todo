import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v1 } from "uuid";

export interface TaskType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "inProgress" | "done";
}

interface taskState {
  tasks: TaskType[];
}
const initialState: taskState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "task",
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
    changeTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: TaskType["status"] }>
    ) {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
  },
});

export const { addTask, editTask, deleteTask, changeTaskStatus } =
  tasksSlice.actions;

export default tasksSlice.reducer;
