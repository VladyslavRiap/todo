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
  status: "done" | "inProgress" | "todo" | "deferred" | "expired";
  timestampCreateTask?: string;
  history?: HistoryEntry[];
  deferredDate?: string;
}

export interface taskState {
  tasks: TaskType[];
  notifiedTaskIds: string[];
}

const initialState: taskState = {
  tasks: [],
  notifiedTaskIds: [],
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
        status: action.payload.deferredDate ? "deferred" : "todo",
      });
    },
    editTask(state, action: PayloadAction<Partial<TaskType> & { id: string }>) {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        const changes: string[] = [];
        const timestamp = dayjs().format("YYYY-MM-DD HH:mm");
        let hasChanges = false;
        Object.keys(action.payload).forEach((key) => {
          const newValue = action.payload[key as keyof TaskType];
          if (updateTaskField(task, key as keyof TaskType, newValue, changes)) {
            hasChanges = true;
          }
        });
        if (hasChanges) {
          task.history = task.history || [];
          task.history.push({ timestamp, changes });
        }
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status as TaskType["status"];
      }
    },
    updateTaskOrder(state, action: PayloadAction<TaskType[]>) {
      state.tasks = action.payload;
    },

    checkDeadlines(state) {
      const now = dayjs();
      state.tasks.forEach((task) => {
        if (
          !state.notifiedTaskIds.includes(task.id) &&
          task.deadline &&
          dayjs(task.deadline).diff(now, "minute") <= 60 &&
          dayjs(task.deadline).isAfter(now)
        ) {
          state.notifiedTaskIds.push(task.id);
        }
      });
    },

    restoreTask(state, action: PayloadAction<string>) {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload
      );

      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = "todo";
      }
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  updateTaskOrder,
  checkDeadlines,
  restoreTask,
  updateTaskStatus,
} = tasksSlice.actions;

export default tasksSlice.reducer;
