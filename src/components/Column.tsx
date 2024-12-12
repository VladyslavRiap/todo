import React, { CSSProperties, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Box } from "@mui/material";
import { RootState } from "../store/store";
import Task from "./Task";
import { TaskType } from "../features/tasks/tasksSlice";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnType } from "./utils/dragAndDrop";

interface ColumnProps {
  status: TaskType["status"];
  title: string;
  column: ColumnType;
  tasks: TaskType[];
}

const Column: React.FC<ColumnProps> = ({ status, title, column, tasks }) => {
  const dispatch = useDispatch();

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status,
    data: {
      type: "column",
      column,
    },
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    backgroundColor: isDragging ? "rgba(255, 255, 255, 0.8)" : "inherit",
    border: isDragging ? "2px solid rgb(243, 58, 106)" : "none",
    minWidth: "300px",
    minHeight: isDragging ? "300px" : "none",
    height: "100%",
    cursor: "pointer",
  };

  if (isDragging) {
    return (
      <Paper
        variant="outlined"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      />
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      elevation={isDragging ? 16 : 1}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </Box>
    </Paper>
  );
};

export default Column;
