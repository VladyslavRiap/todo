import { Box, Button, Container } from "@mui/material";
import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "./contexts/ModalContext";
import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import Task from "./components/Task";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { useDragAndDrop } from "./components/utils/dragAndDrop";
import FilterMenu from "./components/FilterMenu";
import { filterTasks } from "./components/utils/filteringTask";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

const App = () => {
  const { t } = useTranslation();
  const { openModal } = useModal();
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
  } = useDragAndDrop(filteredTasks, columnsFromRedux);

  const columnsId = useMemo(() => columns.map((col) => col.status), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  useEffect(() => {
    setTasks(filteredTasks);
  }, [filteredTasks]);

  useEffect(() => {
    const result = filterTasks(tasksFromRedux, filters);
    setFilteredTasks(result);
  }, [filters, tasksFromRedux]);

  return (
    <Container>
      <Box
        mb={2}
        display={"flex"}
        justifyContent={"space-between"}
        paddingRight={"20px"}
      >
        <Button
          onClick={() =>
            openModal(TASK_MODAL_ID, {
              title: t("newTask"),
              button: t("buttonAdd"),
            })
          }
          variant="contained"
        >
          {t("addTask")}
        </Button>
        <Box display={"flex"}>
          <FilterMenu setFilters={setFilters} />
          <LanguageSwitcher />
        </Box>
      </Box>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <Box
          style={{
            zIndex: 0,
            display: "flex",
            gap: "16px",
            height: "calc(100vh - 200px)",
          }}
        >
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <Box
                key={column.status}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Column
                  onClickLock={onClickLock}
                  column={column}
                  status={column.status}
                  title={t(`columns.${column.status}`)}
                  tasks={tasks.filter((task) => task.status === column.status)}
                  isLock={column.isLock}
                />
              </Box>
            ))}
          </SortableContext>
        </Box>
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
    </Container>
  );
};

export default App;
