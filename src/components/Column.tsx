import React, { CSSProperties, useMemo } from "react";

import { Paper, Typography, Box, Button, Tooltip } from "@mui/material";

import Task from "./Task";
import { TaskType } from "../features/tasks/tasksSlice";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnType } from "./utils/dragAndDrop";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
interface ColumnProps {
  status: TaskType["status"];
  title: string;
  column: ColumnType;
  tasks: TaskType[];
  isLock: boolean;
  onClickLock: (status: TaskType["status"]) => void;
}

const Column: React.FC<ColumnProps> = ({
  status,
  title,
  column,
  tasks,
  isLock,
  onClickLock,
}) => {
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
    disabled: isLock,
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

    height: "100%",
    cursor: isLock ? "" : "pointer",
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
      <Typography
        style={{ display: "flex", justifyContent: "space-between" }}
        variant="h6"
        gutterBottom
      >
        {title}
        <Tooltip title={isLock ? "unlock" : "lock"}>
          <Button onClick={() => onClickLock(status)}>
            {isLock ? <LockIcon color="primary" /> : <LockOpenIcon />}{" "}
          </Button>
        </Tooltip>
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
