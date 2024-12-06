import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, TaskType } from "../features/tasks/tasksSlice";
import { useModal } from "../contexts/ModalContext";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };
  const modalContext = useModal();
  const { handleOpenModal } = modalContext;

  // const handleStatusChange = (status: TaskType["status"]) => {
  // dispatch(changeTaskStatus({ id: task.id, status }));
  //};
  return (
    <div className="task">
      <h3>Title:{task.title}</h3>
      <p>Description:{task.description}</p>
      <p>priority:{task.priority}</p>
      {task.deadline ? <p>deadline:{task.deadline}</p> : ""}
      {task.tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
      <div></div>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => handleOpenModal(task)}>Edit </button>
    </div>
  );
};

export default Task;
