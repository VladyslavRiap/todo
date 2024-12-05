// src/App.tsx

import { useState } from "react";
import Column from "./components/Column";
import { useDispatch } from "react-redux";
import { addTask, editTask, TaskType } from "./features/tasks/tasksSlice";
import Modal from "./components/Modal";

const columnStatuses = [
  { status: "todo" as TaskType["status"], title: "To Do" },
  { status: "inProgress" as TaskType["status"], title: "In Progress" },
  { status: "done" as TaskType["status"], title: "Done" },
];

const App = () => {
  const [modalIsOpern, setModolIsOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);
  const dispatch = useDispatch();

  const handleOpenModal = (task?: TaskType) => {
    task ? setTaskToEdit(task) : setTaskToEdit(null);

    setModolIsOpen(true);
  };

  const handleCloseModal = () => {
    setModolIsOpen(false);
    setTaskToEdit(null);
  };

  const SaveOpenModal = (task: TaskType) => {
    taskToEdit ? dispatch(editTask(task)) : dispatch(addTask(task));
  };

  return (
    <div>
      <div>
        <button onClick={() => handleOpenModal()}> Add New Task</button>
        <Modal
          isOpen={modalIsOpern}
          onClose={handleCloseModal}
          onSave={SaveOpenModal}
          taskToEdit={taskToEdit}
        ></Modal>
      </div>
      <div className="columns">
        {columnStatuses.map((column) => (
          <Column
            key={column.status}
            status={column.status}
            title={column.title}
            onEditTask={handleOpenModal}
          ></Column>
        ))}
      </div>{" "}
    </div>
  );
};

export default App;
