import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";
import { useModal } from "./contexts/ModalContext";
import Modal from "./components/Modal";

const columnStatuses = [
  { status: "todo" as TaskType["status"], title: "To Do" },
  { status: "inProgress" as TaskType["status"], title: "In Progress" },
  { status: "done" as TaskType["status"], title: "Done" },
];

const App = () => {
  const modalContext = useModal();
  const { handleOpenModal } = modalContext;

  return (
    <div>
      <div>
        <button onClick={() => handleOpenModal()}>Add New Task</button>
        <Modal />
      </div>
      <div className="columns">
        {columnStatuses.map((column) => (
          <Column
            key={column.status}
            status={column.status}
            title={column.title}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
