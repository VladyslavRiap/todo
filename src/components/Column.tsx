import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Task from "./Task";
import { TaskType } from "../features/tasks/tasksSlice";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnType } from "../features/columns/columnsSlice";
import { useTranslation } from "react-i18next";
import sortTasks from "./utils/sorteringTask";
import SortMenu from "./SortMenu";
import { useThemeContext } from "../contexts/ThemesContext";
import { MdOutlineDragIndicator } from "react-icons/md";

interface ColumnProps {
  status: TaskType["status"];
  title: string;
  column: ColumnType;
  tasks: TaskType[];
  isLock: boolean;
  onClickLock: (status: TaskType["status"]) => void;
}

const ColumnContainer = styled.div<{
  $isDragging: boolean;
  $isLock: boolean;
  theme: string;
}>`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background-color: ${(props) => (props.theme === "light" ? "#fff" : "#333")};
  border: ${(props) =>
    props.$isDragging ? "2px solid rgb(243, 58, 106)" : "none"};

  cursor: ${(props) => (props.$isLock ? "default" : "default")};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${(props) =>
    props.$isDragging
      ? "0px 4px 15px rgba(0, 0, 0, 0.2)"
      : "0px 4px 15px rgba(0, 0, 0, 0.2)"};
  border-radius: ${(props) => (props.$isDragging ? "8px" : "none")};
  padding: 10px;

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 16px;
    min-height: 200px;
    max-height: ${(props) => (props.$isDragging ? "60px" : "100%")};
  }
`;

const ColumnHeader = styled.div<{ theme: string }>`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: grid;
  grid-template-columns: 0.9fr 1fr 0.1fr 0.1fr;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${(props) =>
    props.theme === "light" ? "#f5f5f5" : "#444"};
  border-bottom: 1px solid
    ${(props) => (props.theme === "light" ? "#ddd" : "#666")};

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 0.1fr 0.1fr;
    padding: 2px;
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

export const DragIconContainer = styled.div<{
  theme: string;
  $isLock: boolean;
}>`
  cursor: ${(props) => (props.$isLock ? "default" : "grab")};
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
      props.theme === "light" ? "#e0e0e0" : "#333"};
  }
`;
const LockIcon = styled.span<{ theme: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 3px;
  border-radius: 15px;
  color: #1976d2;
  font-size: 1rem;
  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#e0e0e0" : "#333"};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LockOpenIcon = styled.span<{ theme: string }>`
  color: #757575;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 3px;
  border-radius: 15px;
  color: #1976d2;
  font-size: 1rem;
  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#e0e0e0" : "#333"};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ColumnTitle = styled.h6<{ theme: string }>`
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};

  @media (max-width: 768px) {
    font-size: 12px;
    margin: 5px;
  }
`;

const LockButton = styled.button<{ theme: string }>`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};

  &:hover {
    color: ${(props) => (props.theme === "light" ? "#f33a6a" : "#f33a6a")};
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ColumnContent = styled.div<{ theme: string }>`
  overflow-y: auto;
  padding: 8px;
  background-color: ${(props) => (props.theme === "light" ? "#fff" : "#444")};
  border-radius: 4px;
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const Column: React.FC<ColumnProps> = ({
  status,
  title,
  column,
  tasks,
  isLock,
  onClickLock,
}) => {
  const { t } = useTranslation();
  const [sortedTasks, setSortedTasks] = useState<TaskType[]>(tasks);
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [isSorted, setIsSorted] = useState(false);

  const { theme } = useThemeContext();

  const handleSort = (order: "lowToHigh" | "highToLow" | "reset") => {
    if (order === "reset") {
      setSortedTasks(tasks);
      setIsSorted(false);
    } else {
      setSortedTasks(sortTasks(tasks, order));
      setIsSorted(true);
    }
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status,
    data: { type: "column", column },
    disabled: isLock,
  });

  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <ColumnContainer
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        $isDragging={isDragging}
        style={style}
        $isLock={isLock}
        theme={theme}
      />
    );
  }

  return (
    <ColumnContainer
      ref={setNodeRef}
      $isDragging={isDragging}
      $isLock={isLock}
      style={style}
      theme={theme}
    >
      <ColumnHeader theme={theme}>
        <ColumnTitle theme={theme}>{t(`columns.${title}`)}</ColumnTitle>

        <SortMenu onSort={handleSort} />
        <LockButton theme={theme} onClick={() => onClickLock(status)}>
          {isLock ? (
            <LockIcon theme={theme}>🔒</LockIcon>
          ) : (
            <LockOpenIcon theme={theme}>🔓</LockOpenIcon>
          )}
        </LockButton>

        <DragIconContainer
          {...attributes}
          {...listeners}
          theme={theme}
          $isLock={isLock}
        >
          <MdOutlineDragIndicator
            size={20}
            color={theme === "light" ? "#333" : "#fff"}
          />
        </DragIconContainer>
      </ColumnHeader>
      <ColumnContent theme={theme}>
        <SortableContext items={tasksIds}>
          {(isSorted ? sortedTasks : tasks).map((task) => (
            <Task key={task.id} task={task} isSorted={isSorted} />
          ))}
        </SortableContext>
      </ColumnContent>
    </ColumnContainer>
  );
};

export default Column;
