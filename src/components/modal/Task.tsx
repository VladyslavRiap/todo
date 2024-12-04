import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, TaskType } from "../../features/tasks/tasksSlice";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  // const handleStatusChange = (status: TaskType["status"]) => {
  // dispatch(changeTaskStatus({ id: task.id, status }));
  //};

  return (
    <div className="task">
      <h3>Title:{task.title}</h3>
      <p>Description:{task.description}</p>
      <p>priority:{task.priority}</p>
      <p>deadline:{task.deadline}</p>
      <p>tags:{task.tags}</p>
      <div></div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Task;
