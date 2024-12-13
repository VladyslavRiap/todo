import { Box, Button, Container } from "@mui/material";
import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "./contexts/ModalContext";
import { useMemo } from "react";
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
import { useDragAndDrop, ColumnType } from "./components/utils/dragAndDrop";

const columnStatuses: ColumnType[] = [
  { status: "todo" as TaskType["status"], title: "To Do", isLock: true },
  {
    status: "inProgress" as TaskType["status"],
    title: "In Progress",
    isLock: false,
  },
  { status: "done" as TaskType["status"], title: "Done", isLock: false },
];

const App = () => {
  const { openModal } = useModal();

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
  } = useDragAndDrop(tasksFromRedux, columnStatuses);

  const columnsId = useMemo(() => columns.map((col) => col.status), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  useEffect(() => {
    setTasks(tasksFromRedux);
  }, [tasksFromRedux]);

  return (
    <Container>
      <Box mb={2}>
        <Button
          onClick={() =>
            openModal(TASK_MODAL_ID, {
              title: "New Task",
              button: "Add Task",
            })
          }
          variant="contained"
        >
          Add New Task
        </Button>
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
                  title={column.title}
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
                title={activeColumn.title}
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
