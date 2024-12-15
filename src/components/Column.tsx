import React, { CSSProperties, useMemo } from "react";
import { Paper, Typography, Box, Button, Tooltip } from "@mui/material";
import Task from "./Task";
import { TaskType } from "../features/tasks/tasksSlice";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { ColumnType } from "../features/columns/columnsSlice";

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
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

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

  const columnStyle: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 30 : "auto",
    backgroundColor: isDragging ? "rgba(255, 255, 255, 0.9)" : "#f7f9fc",
    border: isDragging ? "2px solid rgb(243, 58, 106)" : "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: isDragging ? "0px 4px 15px rgba(0, 0, 0, 0.2)" : "none",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  const contentStyle: CSSProperties = {
    overflowY: "auto",
    maxHeight: "calc(100vh - 160px)",
    padding: "8px",
    boxSizing: "border-box",
  };

  if (isDragging) {
    return (
      <Paper
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={columnStyle}
        elevation={isDragging ? 8 : 2}
      />
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={columnStyle}
      elevation={isDragging ? 8 : 2}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="8px"
        borderBottom="1px solid #ddd"
        bgcolor="#ffffff"
        borderRadius="8px 8px 0 0"
      >
        <Typography variant="h6" component="div" noWrap>
          {title}
        </Typography>
        <Tooltip title={isLock ? "Unlock column" : "Lock column"}>
          <Button
            onClick={() => onClickLock(status)}
            size="small"
            style={{ minWidth: "auto", padding: "4px" }}
          >
            {isLock ? <LockIcon color="primary" /> : <LockOpenIcon />}
          </Button>
        </Tooltip>
      </Box>

      {/* Содержимое колонки */}
      <Box style={contentStyle}>
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
