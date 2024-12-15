// utils/filterTasks.ts
import dayjs from "dayjs";
import { TaskType } from "../../features/tasks/tasksSlice";
type DeadlineFilter = "1 day" | "7 days" | "monthly";

const deadlineFilters: Record<
  DeadlineFilter,
  (taskDeadline: string) => boolean
> = {
  "1 day": (taskDeadline: string) =>
    dayjs(taskDeadline).isBefore(dayjs().add(1, "day")),
  "7 days": (taskDeadline: string) =>
    dayjs(taskDeadline).isBefore(dayjs().add(7, "days")),
  monthly: (taskDeadline: string) =>
    dayjs(taskDeadline).isBefore(dayjs().add(1, "month")),
};

export const filterTasks = (
  tasks: TaskType[],
  filters: { tags?: string[]; deadline?: string; priority?: string }
): TaskType[] => {
  let filtered = tasks;

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((task) =>
      filters.tags!.every((tag) => task.tags?.includes(tag))
    );
  }
  if (filters.priority) {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }

  if (filters.deadline) {
    const deadline = filters.deadline as DeadlineFilter;
    filtered = filtered.filter((task) =>
      deadlineFilters[deadline](task.deadline)
    );
  }

  return filtered;
};
