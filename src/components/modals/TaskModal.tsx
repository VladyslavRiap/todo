import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Modal,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CONFIRM_MODAL_ID, useModal } from "../../contexts/ModalContext";
import { TaskType } from "../../features/tasks/tasksSlice";
import { v1 } from "uuid";
import dayjs, { Dayjs } from "dayjs";

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
const basicTags = ["Work", "Private", "Studying", "Shopping"];

const TaskModal: React.FC<TaskModalProps> = ({
  title,
  button,
  taskToEdit,
  onClose,
}) => {
  const { closeModal, addTaskToList, openModal } = useModal();
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [formats, setFormats] = useState<string[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setTags(taskToEdit.tags);
      setDeadline(taskToEdit.deadline ? dayjs(taskToEdit.deadline) : null);
      setPriority(taskToEdit.priority);
    }
  }, [taskToEdit]);

  const handleSave = () => {
    const newTask: TaskType = {
      id: taskToEdit ? taskToEdit.id : v1(),
      title: taskTitle,
      description,
      tags,
      deadline: deadline ? deadline.format("MM-DD-YYYY") : "",
      priority,
      status: "todo",
    };
    addTaskToList(newTask, taskToEdit);
    if (onClose) onClose();
  };
  const handleEdit = () => {
    setShowConfirm(true);
    openModal(CONFIRM_MODAL_ID, {
      message: "are you confirm?",
      onConfirm: handleConfirm,
      onCancel: handleCancelConfirm,
    });
  };
  const handleConfirm = () => {
    handleSave();
    setShowConfirm(false);
    closeModal(CONFIRM_MODAL_ID);
  };
  const handleCancelConfirm = () => {
    setShowConfirm(false);
    closeModal(CONFIRM_MODAL_ID);
  };
  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  return (
    <>
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
          <TextField
            onChange={(e) => setTaskTitle(e.target.value)}
            value={taskTitle}
            id="taskName"
            label="Task Name"
            variant="filled"
            margin="normal"
            fullWidth
          />
          <TextField
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            id="Description"
            label="Description"
            variant="filled"
            margin="normal"
            fullWidth
          />
          <ToggleButtonGroup
            color="primary"
            value={formats}
            onChange={handleFormat}
            aria-label="Platform"
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
                {tag}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                views={["month", "day", "year"]}
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                label="Basic date picker"
              />
            </DemoContainer>
          </LocalizationProvider>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
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
    </>
  );
};

export default TaskModal;
