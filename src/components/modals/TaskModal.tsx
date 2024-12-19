import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Modal,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CONFIRM_MODAL_ID, useModal } from "../../contexts/ModalContext";
import { TaskType } from "../../features/tasks/tasksSlice";
import { v1 } from "uuid";
import dayjs, { Dayjs } from "dayjs";
import { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TaskModalProps {
  title?: string;
  button?: string;
  taskToEdit?: TaskType | null;
  onClose?: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const basicTags = ["Work", "Private", "Studying", "Shopping"];

export const priorityOptions = ["low", "medium", "high"] as const;

const TaskModal: React.FC<TaskModalProps> = ({
  title,
  button,
  taskToEdit,
  onClose,
}) => {
  const { closeModal, addTaskToList, openModal } = useModal();
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [formats, setFormats] = useState<string[]>([]);
  const [status, setStatus] = useState<TaskType["status"]>("todo");
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setTags(taskToEdit.tags);
      setDeadline(taskToEdit.deadline ? dayjs(taskToEdit.deadline) : null);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const handleSave = () => {
    if (taskTitle.trim() === "") {
      setError(t("error.titleRequired"));
      return;
    }

    if (deadline && deadline.isBefore(dayjs())) {
      setError(t("error.deadlinePast"));
      return;
    }

    const newTask: TaskType = {
      id: taskToEdit ? taskToEdit.id : v1(),
      title: taskTitle,
      description,
      tags,
      deadline: deadline ? deadline.format("YYYY-MM-DD HH:mm") : "",
      priority,
      status,
    };
    addTaskToList(newTask, taskToEdit);
    if (onClose) onClose();
  };

  const handleEdit = () => {
    if (taskTitle.trim() === "") {
      setError(t("error.titleRequired"));
      return;
    }

    if (deadline && deadline.isBefore(dayjs())) {
      setError(t("error.deadlinePast"));
      return;
    }

    openModal(CONFIRM_MODAL_ID, {
      message: t("confirm.message"),
      onConfirm: handleConfirm,
      onCancel: handleCancelConfirm,
    });
  };

  const handleConfirm = () => {
    handleSave();
    closeModal(CONFIRM_MODAL_ID);
  };

  const handleCancelConfirm = () => {
    closeModal(CONFIRM_MODAL_ID);
  };

  const handlePriorityChange = (
    event: SelectChangeEvent<"low" | "medium" | "high">
  ) => {
    setPriority(event.target.value as "low" | "medium" | "high");
  };

  return (
    <Modal
      open
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          onChange={(e) => setTaskTitle(e.target.value)}
          value={taskTitle}
          id="taskName"
          label={t("taskName")}
          variant="filled"
          margin="normal"
          fullWidth
        />
        <TextField
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          id="Description"
          label={t("description")}
          variant="filled"
          margin="normal"
          fullWidth
        />
        <ToggleButtonGroup
          color="primary"
          value={formats}
          onChange={(event, newFormats) => setFormats(newFormats)}
          aria-label="Tags"
          fullWidth
        >
          {basicTags.map((tag) => (
            <ToggleButton
              selected={tags.includes(tag)}
              onClick={() =>
                setTags(
                  tags.includes(tag)
                    ? tags.filter((t) => t !== tag)
                    : [...tags, tag]
                )
              }
              key={tag}
              value={tag}
            >
              {t(`tags.${tag}`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              label={t("deadline")}
            />
          </DemoContainer>
        </LocalizationProvider>

        <FormControl fullWidth margin="normal">
          <InputLabel>{t("priority")}</InputLabel>
          <Select
            value={priority}
            onChange={handlePriorityChange}
            label={t("priority")}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {t(`priorityOptions.${option}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={onClose} variant="contained" color="secondary">
            {t("cancel")}
          </Button>
          <Button
            onClick={taskToEdit ? handleEdit : handleSave}
            variant="contained"
            color="primary"
          >
            {button}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
