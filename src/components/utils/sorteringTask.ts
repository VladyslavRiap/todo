import { TaskType } from "../../features/tasks/tasksSlice";

const sortTasks = (
  tasks: TaskType[],
  order: "lowToHigh" | "highToLow" | "reset"
): TaskType[] => {
  const priorityOrder: { [key: string]: number } = {
    low: 1,
    medium: 2,
    high: 3,
  };

  switch (order) {
    case "lowToHigh":
    case "highToLow":
      const sortedByPriority = [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;

        return priorityA - priorityB;
      });

      return order === "lowToHigh"
        ? sortedByPriority
        : sortedByPriority.reverse();

    case "reset":
    default:
      return [...tasks];
  }
};

export default sortTasks;
