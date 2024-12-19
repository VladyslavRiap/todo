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
import {
  HISTORY_MODAL_ID,
  TASK_MODAL_ID,
  useModal,
} from "../contexts/ModalContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

export interface TaskProps {
  task: TaskType;
  isPreview?: boolean;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleEdit = () => {
    openModal(TASK_MODAL_ID, {
      title: t("editTask"),
      button: t("edit"),
      taskToEdit: task,
    });
  };

  const handleHistory = () => {
    openModal(HISTORY_MODAL_ID, {
      taskToHistory: task,
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
    data: { type: "task", task },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#F33A6A";
      case "medium":
        return "#FFB74D";
      case "low":
        return "#43A047";
      default:
        return "#BDBDBD";
    }
  };

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging
      ? "0px 4px 15px rgba(0, 0, 0, 0.1)"
      : "0px 2px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #ddd",
    marginBottom: "7px",
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          minHeight: "200px",
          minWidth: "270px",
          transition: "all 0.3s ease",
          transform: CSS.Transform.toString(transform),
          opacity: isDragging ? 0.9 : 1,
          boxShadow: isDragging
            ? "0px 4px 15px rgba(0, 0, 0, 0.1)"
            : "0px 2px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid red",
        }}
      ></Card>
    );
  }

  return (
    <Card ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Box
        style={{
          backgroundColor: getPriorityColor(task.priority),
          height: "8px",
          width: "100%",
        }}
      />
      <CardContent>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h6" component="div" gutterBottom>
            {task.title}
          </Typography>
          <Button
            onClick={handleHistory}
            size="small"
            color="success"
            variant="outlined"
          >
            {t("history")}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            maxHeight: "4rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.description}
        </Typography>

        {task.deadline && (
          <Typography variant="body2" color="textSecondary">
            <strong>{t("deadline")}:</strong> {task.deadline}
          </Typography>
        )}

        {task.tags.length > 0 && (
          <Box mt={1} display="flex" flexWrap="wrap" gap="8px">
            {task.tags.map((tag) => (
              <Chip key={tag} label={t(tag)} variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>

      <CardActions style={{ justifyContent: "space-between" }}>
        <Button
          size="small"
          color="error"
          onClick={handleDelete}
          variant="contained"
        >
          {t("delete")}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={handleEdit}
          variant="outlined"
        >
          {t("edit")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Task;
