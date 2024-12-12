import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskType } from "../../features/tasks/tasksSlice";
export type ColumnType = {
  status: TaskType["status"];
  title: string;
};

export function useDragAndDrop(
  tasksFromRedux: TaskType[],
  columnStatuses: ColumnType[]
) {
  const [columns, setColumns] = useState<ColumnType[]>(columnStatuses);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(tasksFromRedux);

  function onDragStart(event: any) {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragOver(event: any) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";
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
    } else if (isActiveATask && isOverATask) {
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

  function onDragEnd(event: any) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.status === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.status === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
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
  };
}
