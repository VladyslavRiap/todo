import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TaskType } from "../tasks/tasksSlice";

export type ColumnType = {
  status: TaskType["status"];
  title: string;
  isLock: boolean;
};

const initialState: { columns: ColumnType[] } = {
  columns: [
    { status: "todo" as TaskType["status"], title: "To Do", isLock: true },
    {
      status: "inProgress" as TaskType["status"],
      title: "In Progress",
      isLock: false,
    },
    { status: "done" as TaskType["status"], title: "Done", isLock: false },
  ],
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    setColumns(state, action: PayloadAction<ColumnType[]>) {
      state.columns = action.payload;
    },
    toggleLock(state, action: PayloadAction<TaskType["status"]>) {
      state.columns = state.columns.map((column) =>
        column.status === action.payload
          ? { ...column, isLock: !column.isLock }
          : column
      );
    },
  },
});

export const { setColumns, toggleLock } = columnsSlice.actions;

export default columnsSlice.reducer;
