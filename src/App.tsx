// src/App.tsx

import { useState } from "react";
import Column from "./components/Column";
import { useDispatch } from "react-redux";
import { addTask, TaskType } from "./features/tasks/tasksSlice";
import Modal from "./components/modal/Modal";

const App = () => {
  const [modalIsOpern, setModolIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setModolIsOpen(true);
  };

  const handleCloseModal = () => {
    setModolIsOpen(false);
  };

  const SaveOpenModal = (task: TaskType) => {
    dispatch(addTask(task));
  };

  return (
    <div>
      <div>
        <button onClick={handleOpenModal}> Add New Task</button>
        <Modal
          isOpen={modalIsOpern}
          onClose={handleCloseModal}
          onSave={SaveOpenModal}
        ></Modal>
      </div>
      <div className="columns">
        <Column status="todo" title="To Do" />
        <Column status="inProgress" title="In Progress" />
        <Column status="done" title="Done" />
      </div>{" "}
    </div>
  );
};

export default App;
