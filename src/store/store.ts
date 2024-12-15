import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import columnsReducer from "../features/columns/columnsSlice";
import { persistReducer, persistStore } from "redux-persist";
import persistConfig from "./persist";

const persistedTasksReducer = persistReducer(persistConfig, tasksReducer);
const persistedColumnsReducer = persistReducer(persistConfig, columnsReducer);

export const store = configureStore({
  reducer: {
    tasks: persistedTasksReducer,
    columns: persistedColumnsReducer,
  },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
