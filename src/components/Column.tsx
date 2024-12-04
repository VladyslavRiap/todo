import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Task from "./Task";
import { TaskType } from "../features/tasks/tasksSlice";

interface ColumnProps {
  status: TaskType["status"];
  title: string;
}

const Column: React.FC<ColumnProps> = ({ status, title }) => {
  const tasks = useSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.status === status)
  );

  return (
    <div className="column">
      <h2>{title}</h2>
      <div>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
