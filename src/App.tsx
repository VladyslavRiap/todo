import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "./components/Task";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useDragAndDrop } from "./components/utils/dragAndDrop";
import FilterMenu from "./components/FilterMenu";
import { filterTasks } from "./components/utils/filteringTask";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { DeadlineNotifier } from "./components/DeadLineNotice";
import { useThemeContext } from "./contexts/ThemesContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import HamburgerMenu from "./components/HamburgerMenu";

const AppContainer = styled.div`
  padding: 16px;
  width: 70%;
  margin: 0 auto;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    width: 80%;
    padding: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 16px;
  height: calc(100vh - 200px);
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: auto;
  }
`;
const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme.mode === "light" ? "#f0f0f0" : "#333"};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.mode === "light" ? "#e0e0e0" : "#444"};
    transform: scale(1.1);
  }
`;

const ThemeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#f0f0f0")};
  transition: color 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }
`;
const DndContainer = styled.div`
  touch-action: none;
  user-select: none;
`;

const ColumnWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;

  @media (max-width: 768px) {
    padding-top: 5px;
  }
`;

const App = () => {
  const { t } = useTranslation();

  const columnsFromRedux = useSelector(
    (state: RootState) => state.columns.columns
  );
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [filters, setFilters] = useState<{
    tags?: string[];
    deadline?: string;
  }>({});
  const tasksFromRedux = useSelector((state: RootState) => state.tasks.tasks);
  const {
    columns,
    activeColumn,
    activeTask,
    tasks,
    setTasks,
    onDragStart,
    onDragOver,
    onDragEnd,
    onClickLock,
    sensors,
  } = useDragAndDrop(filteredTasks, columnsFromRedux);

  const columnsId = useMemo(() => columns.map((col) => col.status), [columns]);

  useEffect(() => {
    setTasks(filteredTasks);
  }, [filteredTasks]);

  useEffect(() => {
    const result = filterTasks(tasksFromRedux, filters);
    setFilteredTasks(result);
  }, [filters, tasksFromRedux]);

  const { theme, toggleTheme } = useThemeContext();

  return (
    <AppContainer>
      <Header>
        <HamburgerMenu />
        <ButtonContainer>
          <FilterMenu setFilters={setFilters} />
          <LanguageSwitcher />
          <ThemeToggleContainer onClick={toggleTheme}>
            <ThemeIcon>
              {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
            </ThemeIcon>
          </ThemeToggleContainer>
        </ButtonContainer>
      </Header>
      <DndContainer>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <ColumnContainer>
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnWrapper key={column.status}>
                  <Column
                    onClickLock={onClickLock}
                    column={column}
                    status={column.status}
                    title={t(`columns.${column.status}`)}
                    tasks={tasks.filter(
                      (task) => task.status === column.status
                    )}
                    isLock={column.isLock}
                  />
                </ColumnWrapper>
              ))}
            </SortableContext>
          </ColumnContainer>
          {createPortal(
            <DragOverlay>
              {activeColumn && !activeColumn.isLock && (
                <Column
                  onClickLock={onClickLock}
                  column={activeColumn}
                  status={activeColumn.status}
                  title={t(`columns.${activeColumn.status}`)}
                  isLock={activeColumn.isLock}
                  tasks={tasks.filter(
                    (task) => task.status === activeColumn.status
                  )}
                />
              )}
              {activeTask && <Task task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </DndContainer>
      <DeadlineNotifier />
    </AppContainer>
  );
};

export default App;
