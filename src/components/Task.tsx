import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, TaskType } from "../features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "../contexts/ModalContext";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const { openModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleEdit = () => {
    openModal(TASK_MODAL_ID, {
      title: "Edit Task",
      button: "Edit",
      taskToEdit: task,
    });
  };

  return (
    <div className="task">
      <h3>Title: {task.title}</h3>
      <p>description: {task.description}</p>
      <p>priority: {task.priority}</p>
      {task.deadline && <p>deadline: {task.deadline}</p>}
      {task.tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
      <div></div>
      <button onClick={handleDelete}>delete</button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default Task;
