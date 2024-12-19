import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { updateTaskField } from "../../components/utils/languageUtils";

interface HistoryEntry {
  timestamp: string;
  changes: string[];
}

export interface TaskType {
  id: string;
  title: string;
  description: string;
  tags: string[];
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "done" | "inProgress" | "todo";
  timestampCreateTask?: string;
  history?: HistoryEntry[];
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
      state.tasks.push({
        ...action.payload,
        id: v1(),
        timestampCreateTask: dayjs().format("YYYY-MM-DD HH:mm"),
        history: [],
      });
    },
    editTask(state, action: PayloadAction<Partial<TaskType> & { id: string }>) {
      const task = state.tasks.find((task) => task.id === action.payload.id);

      if (task) {
        const changes: string[] = [];
        const timestamp = dayjs().format("YYYY-MM-DD HH:mm");

        Object.keys(action.payload).forEach((key) => {
          const newValue = action.payload[key as keyof TaskType];
          updateTaskField(task, key as keyof TaskType, newValue, changes);
        });

        if (changes.length > 0) {
          task.history = task.history || [];
          task.history.push({ timestamp, changes });
        }
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
