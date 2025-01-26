import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskType, updateTaskStatusApi } from "../../features/tasks/tasksSlice";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  ColumnType,
  setColumns,
  toggleLock,
} from "../../features/columns/columnsSlice";
import { useAppDispatch } from "../../store/store";

export function useDragAndDrop(
  tasksFromRedux: TaskType[],
  columnStatuses: ColumnType[]
) {
  const [columns, setColumnsState] = useState<ColumnType[]>(columnStatuses);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(tasksFromRedux);

  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const onClickLock = (status: TaskType["status"]) => {
    dispatch(toggleLock(status));
    setColumnsState(
      columns.map((column) => {
        if (column.status === status) {
          return { ...column, isLock: !column.isLock };
        } else {
          return column;
        }
      })
    );
  };

  function onDragStart(event: DragStartEvent) {
    const { current } = event.active.data;

    if (current?.type === "column") {
      const column = current.column;
      if (column?.isLock) {
        setActiveColumn(null);
        return;
      } else {
        setActiveColumn(column);
      }
    }

    if (current?.type === "task") {
      setActiveTask(current.task);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "task";
    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: overId as TaskType["status"],
        };

        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    } else if (isActiveATask && over.data.current?.type === "task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: tasks[overIndex].status,
        };

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "task";
    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveATask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      const updatedTasks = arrayMove(tasks, activeIndex, overIndex);
      dispatch(
        updateTaskStatusApi({
          id: tasks[activeIndex].id,
          status: updatedTasks[overIndex].status,
        })
      );
    } else if (isOverAColumn) {
      const overColumn = columns.find((col) => col.status === overId);
      if (overColumn?.isLock) {
        return;
      }

      setColumnsState((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.status === activeId
        );
        const overColumnIndex = columns.findIndex(
          (col) => col.status === overId
        );
        const newColumns = arrayMove(
          columns,
          activeColumnIndex,
          overColumnIndex
        );
        dispatch(setColumns(newColumns));
        return newColumns;
      });
    }
  }

  return {
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
  };
}
