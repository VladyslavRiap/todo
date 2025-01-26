import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { updateTaskField } from "../../components/utils/languageUtils";
import instance from "../../api/axios";
import { RootState } from "../../store/store";
import {
  loadTasksFromLocalStorage,
  removeTaskFromLocalStorage,
  saveTasksToLocalStorage,
} from "../../components/utils/localStorage";
type TaskOrderUpdate = {
  id: string;
  order: string | undefined;
};

interface HistoryEntry {
  timestamp: string;
  changes: string[];
}

export interface TaskType {
  id: string;
  order?: string;
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
  status: string;
  error: any;
}

const initialState: taskState = {
  tasks: [],
  notifiedTaskIds: [],
  status: "idle",
  error: null,
};

export const fetchTodos = createAsyncThunk(
  "tasks/fetchTodos",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    if (!state.auth.token) {
      return loadTasksFromLocalStorage();
    }

    try {
      const res = await instance.get("/todos");
      return res.data;
    } catch (err) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const addTaskApi = createAsyncThunk(
  "tasks/addTaskApi",
  async (newTask: TaskType, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    if (!state.auth.token) {
      const tasks = loadTasksFromLocalStorage();
      const updatedTasks = [newTask, ...tasks];
      saveTasksToLocalStorage(updatedTasks);
      return newTask;
    }

    try {
      const res = await instance.post("/todos", newTask);
      return res.data;
    } catch (err) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const deleteTaskApi = createAsyncThunk(
  "tasks/deleteTaskApi",
  async (id: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    if (!state.auth.token) {
      removeTaskFromLocalStorage(id);
      return id;
    }

    try {
      const res = await instance.delete(`/todos/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const restoreTaskApi = createAsyncThunk(
  "tasks/restoreTaskApi",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const res = await instance.patch(`/todos/${taskId}/restore`);
      return res.data;
    } catch (err) {
      const errorMessage = (err as { message: string }).message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const editTaskApi = createAsyncThunk(
  "tasks/editTaskApi",
  async (
    updatedTask: { id: string; updates: Partial<TaskType> },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { tasks: taskState };
      const task = state.tasks.tasks.find((task) => task.id === updatedTask.id);
      if (!task) {
        console.error("Задача не найдена:", updatedTask.id);
        return rejectWithValue("Task not found");
      }
      const taskCopy = JSON.parse(JSON.stringify(task));
      const changes: string[] = [];
      const timestamp = dayjs().format("YYYY-MM-DD HH:mm");
      let hasChanges = false;
      Object.keys(updatedTask.updates).forEach((key) => {
        const newValue = updatedTask.updates[key as keyof TaskType];
        if (
          updateTaskField(taskCopy, key as keyof TaskType, newValue, changes)
        ) {
          hasChanges = true;
        }
      });
      if (hasChanges) {
        taskCopy.history = taskCopy.history || [];
        taskCopy.history.push({ timestamp, changes });
      }

      const response = await instance.put(`/todos/${updatedTask.id}`, taskCopy);

      return response.data;
    } catch (err) {
      const errorMessage = (err as { message: string }).message;
      console.error("Ошибка при обновлении задачи:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTaskStatusApi = createAsyncThunk(
  "tasks/updateTaskStatusApi",
  async (
    statusUpdate: { id: string; status: TaskType["status"] },
    { rejectWithValue, getState }
  ) => {
    const state = getState() as RootState;

    // Handle unauthenticated case using localStorage
    if (!state.auth.token) {
      try {
        const tasks = loadTasksFromLocalStorage();
        const taskIndex = tasks.findIndex(
          (task) => task.id === statusUpdate.id
        );
        if (taskIndex !== -1) {
          tasks[taskIndex].status = statusUpdate.status;
          saveTasksToLocalStorage(tasks);
          return tasks[taskIndex];
        }
        return rejectWithValue("Task not found in localStorage");
      } catch (err) {
        return rejectWithValue("Error updating task in localStorage");
      }
    }

    // Handle authenticated case with API
    try {
      const res = await instance.patch(`/todos/${statusUpdate.id}/status`, {
        status: statusUpdate.status,
      });
      return res.data;
    } catch (err) {
      const errorMessage = (err as { message: string }).message;
      return rejectWithValue(errorMessage);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
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
    resetTasks(state) {
      state.tasks = [];
      state.notifiedTaskIds = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succesfull";
        state.tasks = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(addTaskApi.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(deleteTaskApi.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.meta.arg);
      })
      .addCase(editTaskApi.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTaskStatusApi.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })

      .addCase(restoreTaskApi.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t.id === action.meta.arg);
        if (task) {
          task.status = "todo";
        }
      });
  },
});

export const { checkDeadlines, resetTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
