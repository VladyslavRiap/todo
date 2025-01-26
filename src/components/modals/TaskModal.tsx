import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";
import { v1 } from "uuid";
import { useTranslation } from "react-i18next";
import { TaskType } from "../../features/tasks/tasksSlice";
import { CONFIRM_MODAL_ID, useModal } from "../../contexts/ModalContext";
import { useThemeContext } from "../../contexts/ThemesContext";
import { useSnackbarContext } from "../../contexts/SnackBarContext";
import { Button, Overlay } from "../utils/commonStyles";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface TaskModalProps {
  title?: string;
  button?: string;
  taskToEdit?: TaskType | null;
  onClose?: () => void;
}

export const basicTags = ["Work", "Private", "Studying", "Shopping"];
export const priorityOptions = ["low", "medium", "high"] as const;

const ModalContent = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  width: 450px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (max-width: 768px) {
    width: 90%;
    padding: 16px;
  }
`;

const Title = styled.h2<{ theme: string }>`
  font-size: 20px;
  margin: 0 0 16px;
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
`;

const Input = styled.input<{ theme: string }>`
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#555" : "#ccc")};
  background: ${({ theme }) => (theme === "dark" ? "#444" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  border-radius: 8px;
  width: 95%;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TextArea = styled.textarea<{ theme: string }>`
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#555" : "#ccc")};
  background: ${({ theme }) => (theme === "dark" ? "#444" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  border-radius: 8px;
  width: 95%;
  resize: none;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TagButton = styled.button<{ selected: boolean; theme: string }>`
  padding: 8px 16px;
  border: 1px solid
    ${({ selected, theme }) =>
      selected ? "#007bff" : theme === "dark" ? "#555" : "#ccc"};
  background-color: ${({ selected, theme }) =>
    selected ? "#007bff" : theme === "dark" ? "#444" : "transparent"};
  color: ${({ selected, theme }) =>
    selected ? "#fff" : theme === "dark" ? "#fff" : "#000"};
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected
        ? "#0056b3"
        : theme === "dark"
        ? "#555"
        : "rgba(0, 123, 255, 0.1)"};
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const TagGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const Select = styled.select<{ theme: string }>`
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#555" : "#ccc")};
  background: ${({ theme }) => (theme === "dark" ? "#444" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  border-radius: 8px;
  width: 101%;

  @media (max-width: 768px) {
    font-size: 12px;
    width: 103%;
  }
`;

const DateTimeInput = styled.input<{ theme: string }>`
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#555" : "#ccc")};
  background: ${({ theme }) => (theme === "dark" ? "#444" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  border-radius: 8px;
  width: 95%;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;

    button {
      width: 100%;
    }
  }
`;

const DateTimeContainer = styled.div`
  padding-top: 12px;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

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
  const [status, setStatus] = useState<TaskType["status"]>("todo");
  const [error, setError] = useState<string>("");
  const [deferredDate, setDeferredDate] = useState<Dayjs | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { showMessage } = useSnackbarContext();
  const isAuth = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setTags(taskToEdit.tags);
      setDeadline(taskToEdit.deadline ? dayjs(taskToEdit.deadline) : null);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDeferredDate(null);
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
    if (deferredDate && deferredDate.isBefore(dayjs())) {
      setError("deferredPast");
      return;
    }
    const newTask: TaskType = {
      id: taskToEdit ? taskToEdit.id : v1(),
      title: taskTitle,
      description,
      tags,
      deadline: deadline ? deadline.format("YYYY-MM-DD HH:mm") : "",
      priority,
      deferredDate: deferredDate ? deferredDate.format("YYYY-MM-DD") : "",

      status: taskToEdit
        ? taskToEdit.status
        : deferredDate
        ? "deferred"
        : "todo",
      timestampCreateTask: dayjs().format("YYYY-MM-DD HH:mm"),
    };

    addTaskToList(newTask, taskToEdit);
    showMessage(
      `Task successfully ${taskToEdit ? "edited" : "added"}`,
      "success"
    );

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
    if (deferredDate && deferredDate.isBefore(dayjs())) {
      setError("deferredPast");
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

  const toggleTag = (tag: string) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <Overlay id="overlay">
      <ModalContent theme={theme}>
        <Title theme={theme}>{title}</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Input
          theme={theme}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder={t("taskName")}
        />
        <TextArea
          theme={theme}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("description")}
          rows={4}
        />

        <TagGroup>
          {basicTags.map((tag) => (
            <TagButton
              key={tag}
              theme={theme}
              selected={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {t(`tags.${tag}`)}
            </TagButton>
          ))}
        </TagGroup>

        <DateTimeInput
          theme={theme}
          type="datetime-local"
          value={deadline ? deadline.format("YYYY-MM-DDTHH:mm") : ""}
          onChange={(e) => setDeadline(dayjs(e.target.value))}
        />

        <Select
          theme={theme}
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
        >
          {priorityOptions.map((option) => (
            <option key={option} value={option}>
              {t(`priorityOptions.${option}`)}
            </option>
          ))}
        </Select>
        <div>
          {isAuth.user === null ? (
            ""
          ) : (
            <>
              {" "}
              <Button
                theme={theme}
                $variant="secondary"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                {t("deferredTask")}
              </Button>
              {showDatePicker && (
                <DateTimeContainer>
                  <DateTimeInput
                    theme={theme}
                    type="date"
                    value={
                      deferredDate ? deferredDate.format("YYYY-MM-DD") : ""
                    }
                    onChange={(e) => setDeferredDate(dayjs(e.target.value))}
                  />
                </DateTimeContainer>
              )}
            </>
          )}
        </div>

        <ButtonGroup>
          <Button theme={theme} $variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            theme={theme}
            $variant="primary"
            onClick={taskToEdit ? handleEdit : handleSave}
          >
            {button}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Overlay>
  );
};

export default TaskModal;
