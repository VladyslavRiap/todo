import React, { CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { deleteTask, TaskType } from "../features/tasks/tasksSlice";
import {
  HISTORY_MODAL_ID,
  TASK_MODAL_ID,
  TASK_MODAL_VIEW_ID,
  useModal,
} from "../contexts/ModalContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { RootState } from "../store/store";
import { useThemeContext } from "../contexts/ThemesContext";
import { MdDeleteOutline, MdOutlineDragIndicator } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { useSnackbarContext } from "../contexts/SnackBarContext";

export interface TaskProps {
  task: TaskType;
  isPreview?: boolean;
  isSorted?: boolean;
}

const pulseAnimation = `
  @keyframes pulse {
    0% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(0.8);
    }
    100% {
      filter: brightness(1);
    }
  }
`;

const TaskContainer = styled.div<{
  isDragging: boolean;
  cursor: string;
  deadlineColor: string;
  pulse: boolean;
  theme: string;
}>`
  transition: ${(props) => (props.isDragging ? "all 0.3s ease" : "none")};
  transform: ${(props) => (props.isDragging ? "scale(1.02)" : "none")};
  opacity: ${(props) => (props.isDragging ? 0.9 : 1)};
  box-shadow: ${(props) =>
    props.isDragging
      ? "0px 4px 15px rgba(0, 0, 0, 0.1)"
      : "0px 2px 5px rgba(0, 0, 0, 0.2)"};
  border: ${(props) =>
    props.isDragging ? "1px solid red" : "1px solid #ddd;"};
  border-radius: 8px;
  margin-bottom: 7px;
  cursor: ${(props) => props.cursor};
  overflow: hidden;
  background: ${(props) =>
    props.deadlineColor === "yellow"
      ? "#FFF3CD"
      : props.theme === "light"
      ? "#ffffff"
      : "#2C2C2C"};
  height: ${(props) => (props.isDragging ? "170px" : "")};
  animation: ${(props) => (props.pulse ? `pulse 5s infinite` : "none")};
  ${pulseAnimation}

  touch-action: none;
  user-select: none;
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
    margin-bottom: 15px;
  }
`;

const PriorityBar = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  height: 8px;
  width: 100%;
`;

const TaskContent = styled.div<{ theme: string }>`
  padding-left: 16px;
  padding-bottom: 16px;
  padding-top: 16px;
  background: ${(props) => (props.theme === "light" ? "#fff" : "#333")};
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const TitleContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.4fr 0.4fr;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 768px) {
  }
`;

const TaskTitle = styled.h6<{ theme: string }>`
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Deadline = styled.p<{ theme: string }>`
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};
  font-size: 0.8rem;
  margin: 8px 0;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span<{ theme: string }>`
  background: ${(props) => (props.theme === "light" ? "#e0e0e0" : "#666")};
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 0.8rem;
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 16px;
  border-top: 1px solid #ddd;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const IconContainer = styled.div<{ theme: string }>`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.theme === "light" ? "#e0e0e0" : "#444"};
  }
`;

export const DragIconContainer = styled.div<{ theme: string }>`
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 3px;
  border-radius: 15px;
  &:active {
    cursor: grabbing;
  }
  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#e0e0e0" : "#444"};
  }
`;

const Task: React.FC<TaskProps> = ({ task, isSorted }) => {
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const notifiedTaskIds = useSelector(
    (state: RootState) => state.tasks.notifiedTaskIds
  );
  const { showMessage } = useSnackbarContext();
  const { theme } = useThemeContext();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    showMessage(`Task ${task.title} deleted`, "error");
  };

  const handleEdit = () => {
    openModal(TASK_MODAL_ID, {
      title: t("editTask"),
      button: t("edit"),
      taskToEdit: task,
    });
  };
  const handleModalView = () => {
    openModal(TASK_MODAL_VIEW_ID, {
      task: task,
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
    disabled: isSorted,
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

  const cursorStyle = isSorted ? "default" : "default";
  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const deadlineColor = notifiedTaskIds.includes(task.id) ? "yellow" : "white";
  const pulseEffect = deadlineColor === "yellow";

  if (isDragging) {
    return (
      <TaskContainer
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        isDragging={isDragging}
        cursor={cursorStyle}
        deadlineColor={deadlineColor}
        pulse={pulseEffect}
        theme={theme}
      />
    );
  }

  return (
    <TaskContainer
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      cursor={cursorStyle}
      deadlineColor={deadlineColor}
      pulse={pulseEffect}
      theme={theme}
    >
      <PriorityBar color={getPriorityColor(task.priority)} />
      <TaskContent theme={theme}>
        <TitleContainer>
          <TaskTitle onClick={handleModalView} theme={theme}>
            {task.title}
          </TaskTitle>
          <IconContainer onClick={handleHistory} theme={theme}>
            <GoHistory />
          </IconContainer>

          {!isSorted ? (
            <DragIconContainer {...attributes} {...listeners} theme={theme}>
              <MdOutlineDragIndicator
                size={20}
                color={theme === "light" ? "#333" : "#fff"}
              />
            </DragIconContainer>
          ) : (
            ""
          )}
        </TitleContainer>

        {task.deadline && (
          <Deadline theme={theme}>
            <strong>{t("deadline")}:</strong> {task.deadline}
          </Deadline>
        )}
        {task.tags.length > 0 && (
          <TagContainer>
            {task.tags.map((tag) => (
              <Tag key={tag} theme={theme}>
                {t(tag)}
              </Tag>
            ))}
          </TagContainer>
        )}
      </TaskContent>
      <TaskActions>
        <IconContainer onClick={handleDelete} theme={theme}>
          <MdDeleteOutline color="red" />
        </IconContainer>

        <IconContainer onClick={handleEdit} theme={theme}>
          <CiEdit color="green" />
        </IconContainer>
      </TaskActions>
    </TaskContainer>
  );
};

export default Task;
