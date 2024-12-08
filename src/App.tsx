import { Button } from "@mui/material";
import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "./contexts/ModalContext";

const columnStatuses = [
  { status: "todo" as TaskType["status"], title: "To Do" },
  { status: "inProgress" as TaskType["status"], title: "In Progress" },
  { status: "done" as TaskType["status"], title: "Done" },
];

const App2 = () => {
  const { modal, openModal } = useModal();
  console.log(modal, openModal);
  return (
    <div>
      <div>
        <Button
          onClick={() =>
            openModal(TASK_MODAL_ID, { title: "New Task", button: "Add Task" })
          }
          variant="contained"
        >
          Add New Task
        </Button>
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

export default App2;
