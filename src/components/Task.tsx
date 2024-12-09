import React from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import { deleteTask, TaskType } from "../features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "../contexts/ModalContext";
import { useDrag } from "react-dnd";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const { openModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleEdit = () => {
    openModal(TASK_MODAL_ID, {
      title: "Edit Task",
      button: "Edit",
      taskToEdit: task,
    });
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "task",
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Tooltip title="Move me ">
      <Card
        ref={dragRef}
        style={{
          marginBottom: "16px",
          border: "0.1px solid black",
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isDragging ? "#bdbdbd" : "white",
          transition: "background-color     0.3s ease",
          cursor: "pointer",
        }}
      >
        <CardContent>
          <Typography variant="h6">Title: {task.title}</Typography>
          <Typography variant="body2">
            Description: {task.description}
          </Typography>
          <Typography variant="body2">Priority: {task.priority}</Typography>
          {task.deadline && (
            <Typography variant="body2">Deadline: {task.deadline}</Typography>
          )}
          <Box>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                style={{ marginRight: "4px", marginBottom: "4px" }}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button size="small" color="secondary" onClick={handleDelete}>
            Delete
          </Button>
          <Box marginLeft="auto">
            <Button size="small" color="primary" onClick={handleEdit}>
              Edit
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Tooltip>
  );
};

export default Task;
