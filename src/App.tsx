import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Column from "./components/Column";
import { fetchTodos, TaskType } from "./features/tasks/tasksSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Task from "./components/Task";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useDragAndDrop } from "./components/utils/dragAndDrop";
import FilterMenu from "./components/FilterMenu";
import { filterTasks } from "./components/utils/filteringTask";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { DeadlineNotifier } from "./components/DeadLineNotice";

import HamburgerMenu from "./components/HamburgerMenu";
import ThemeToggle from "./components/ThemeToggle";
import { useSnackbarContext } from "./contexts/SnackBarContext";
import LoginRegister from "./components/LoginRegister";
import { ButtonContainer } from "./components/utils/commonStyles";

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
const ContrainerSpinner = styled.div`
  display: flex;
  justify-content: center;
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

const App = () => {
  const { t } = useTranslation();
  const { status, error } = useSelector((state: RootState) => state.tasks);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const { showMessage } = useSnackbarContext();
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
    if (auth.token) {
      dispatch(fetchTodos());
    }
  }, [auth.token]);
  useEffect(() => {
    setTasks(filteredTasks);
  }, [filteredTasks]);

  useEffect(() => {
    const result = filterTasks(tasksFromRedux, filters);
    setFilteredTasks(result);
  }, [filters, tasksFromRedux]);

  return (
    <AppContainer>
      <Header>
        <HamburgerMenu />
        <ButtonContainer>
          <LoginRegister />
          <FilterMenu setFilters={setFilters} />
          <LanguageSwitcher />
          <ThemeToggle />
        </ButtonContainer>
      </Header>
      <ContrainerSpinner>
        {status === "loading" && <CircularProgress size="100px" />}
        {error && showMessage(` ${error}`, "error")}
      </ContrainerSpinner>

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
                    title={column.status}
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
                  title={activeColumn.status}
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
