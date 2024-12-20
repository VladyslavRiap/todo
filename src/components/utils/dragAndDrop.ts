import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskType, updateTaskOrder } from "../../features/tasks/tasksSlice";
import { useDispatch } from "react-redux";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import {
  ColumnType,
  setColumns,
  toggleLock,
} from "../../features/columns/columnsSlice";

export function useDragAndDrop(
  tasksFromRedux: TaskType[],
  columnStatuses: ColumnType[]
) {
  const [columns, setColumnsState] = useState<ColumnType[]>(columnStatuses);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(tasksFromRedux);

  const dispatch = useDispatch();

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
    if (event.active.data.current?.type === "column") {
      const column = event.active.data.current?.column;
      if (column?.isLock) {
        setActiveColumn(null);
        return;
      } else {
        setActiveColumn(column);
      }
    }

    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
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
      dispatch(updateTaskOrder(updatedTasks));
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
  };
}
