import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";
import authReducer from "../features/auth/authSlice";
import columnsReducer from "../features/columns/columnsSlice";
import { persistReducer, persistStore } from "redux-persist";
import persistConfig from "./persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const persistedColumnsReducer = persistReducer(persistConfig, columnsReducer);
const persistedTasksReducer = persistReducer(persistConfig, tasksReducer);
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: persistedTasksReducer,
    columns: persistedColumnsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
