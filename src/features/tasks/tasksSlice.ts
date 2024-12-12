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
    reorderTasks: (
      state,
      action: PayloadAction<{ activeId: string; overId: string }>
    ) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.tasks.findIndex((task) => task.id === activeId);
      const newIndex = state.tasks.findIndex((task) => task.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedTask] = state.tasks.splice(oldIndex, 1);
        state.tasks.splice(newIndex, 0, movedTask);
      }
    },
    changeTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskType["status"] }>
    ) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.status = status;
      }
    },
  },
});

export const { addTask, editTask, deleteTask, changeTaskStatus, reorderTasks } =
  tasksSlice.actions;

export default tasksSlice.reducer;
