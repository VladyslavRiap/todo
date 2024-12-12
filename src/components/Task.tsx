import React, { CSSProperties } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { deleteTask, TaskType } from "../features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "../contexts/ModalContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export interface TaskProps {
  task: TaskType;
  isPreview?: boolean;
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
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    backgroundColor: isDragging ? "rgba(255, 255, 255, 0.8)" : "inherit",
    border: isDragging ? "2px solid 	rgb(243, 58, 106)" : "none",
    opacity: isDragging ? 0.5 : 1,

    minWidth: "300px",
    minHeight: "150px",
  };
  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      ></Card>
    );
  }

  return (
    <Card ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <CardContent className="card-content">
        <Typography variant="h6">Title: {task.title}</Typography>
        <Typography variant="body2">Description: {task.description}</Typography>
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

      <CardActions style={{ display: "flex" }}>
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
  );
};

export default Task;
