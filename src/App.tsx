import { Box, Button, Container, Grid } from "@mui/material";
import Column from "./components/Column";
import { TaskType } from "./features/tasks/tasksSlice";
import { TASK_MODAL_ID, useModal } from "./contexts/ModalContext";
import CustomDragLayer from "./components/CustomDragLayer";

const columnStatuses = [
  { status: "todo" as TaskType["status"], title: "To Do" },
  { status: "inProgress" as TaskType["status"], title: "In Progress" },
  { status: "done" as TaskType["status"], title: "Done" },
];

const App2 = () => {
  const { openModal } = useModal();

  return (
    <Container>
      <Box mb={2}>
        <Button
          onClick={() =>
            openModal(TASK_MODAL_ID, { title: "New Task", button: "Add Task" })
          }
          variant="contained"
        >
          Add New Task
        </Button>
      </Box>
      <Grid container spacing={3}>
        {columnStatuses.map((column) => (
          <Grid item xs={12} md={4} key={column.status}>
            <Column status={column.status} title={column.title} />
          </Grid>
        ))}
      </Grid>
      <CustomDragLayer />
    </Container>
  );
};

export default App2;
