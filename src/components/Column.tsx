import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Box } from "@mui/material";
import { RootState } from "../store/store";
import Task from "./Task";
import { changeTaskStatus, TaskType } from "../features/tasks/tasksSlice";
import { useDrop } from "react-dnd";

interface ColumnProps {
  status: TaskType["status"];
  title: string;
}

const Column: React.FC<ColumnProps> = ({ status, title }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.status === status)
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: TaskType) => {
      dispatch(changeTaskStatus({ id: item.id, status }));
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  return (
    <Paper
      ref={drop}
      elevation={isOver ? 24 : 3}
      style={{ padding: "16px", marginBottom: "16px" }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </Box>
    </Paper>
  );
};

export default Column;
