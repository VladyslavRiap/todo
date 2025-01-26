import { TaskType } from "../../features/tasks/tasksSlice";

const LOCAL_STORAGE_KEY = "tasks";

export const loadTasksFromLocalStorage = (): TaskType[] => {
  const tasks = localStorage.getItem(LOCAL_STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasksToLocalStorage = (tasks: TaskType[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

export const removeTaskFromLocalStorage = (id: string): void => {
  const tasks = loadTasksFromLocalStorage();
  const updatedTasks = tasks.filter((task) => task.id !== id);
  saveTasksToLocalStorage(updatedTasks);
};
