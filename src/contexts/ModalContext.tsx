import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask, TaskType } from "../features/tasks/tasksSlice";
import { v1 } from "uuid";

interface Modal {
  id: string;
  options: {
    closeWhenClickOutside?: boolean;
  };
}

interface ModalContextType {
  modals: Modal[];
  openModal: (
    componentId: string,
    options: { closeWhenClickOutside?: boolean }
  ) => void;
  closeModal: (componentId: string) => void;
  closeAllModals: () => void;
  closeWhenClickOutside: (event: MouseEvent) => void;
  handleSaveTask: () => void;
  setTaskToEdit: (task: TaskType | null) => void;
  handleOpenModal: (task?: TaskType) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  deadline: string;
  setDeadline: (deadline: string) => void;
  priority: "high" | "medium" | "low";
  setPriority: (priority: "high" | "medium" | "low") => void;
  taskToEdit: TaskType | null;
  toggleTag: (tag: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>([]);
  const [taskToEdit, setTaskToEditState] = useState<TaskType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const dispatch = useDispatch();

  const openModal = (
    componentId: string,
    options: { closeWhenClickOutside?: boolean }
  ) => {
    setModals((prevModals) => [...prevModals, { id: componentId, options }]);
  };

  const closeModal = (componentId: string) => {
    setModals((prevModals) =>
      prevModals.filter((modal) => modal.id !== componentId)
    );
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const closeWhenClickOutside = (event: MouseEvent) => {
    const currentModal = modals.length > 0 ? modals[0] : null;
    const closeWhenClickOutside =
      currentModal?.options.closeWhenClickOutside ?? true;
    if (closeWhenClickOutside && currentModal) {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(event.target as Node)) {
        closeModal(currentModal.id);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      closeWhenClickOutside(event);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modals]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setTags(taskToEdit.tags);
      setDeadline(taskToEdit.deadline);
      setPriority(taskToEdit.priority);
    } else {
      setTitle("");
      setDescription("");
      setTags([]);
      setDeadline("");
      setPriority("medium");
    }
  }, [taskToEdit]);

  const handleSaveTask = () => {
    if (title.trim() === "") {
      alert("Title is required");
      return;
    }
    const newTask: TaskType = {
      id: taskToEdit ? taskToEdit.id : v1(),
      title,
      description,
      tags,
      deadline,
      priority,
      status: taskToEdit ? taskToEdit.status : "todo",
    };
    taskToEdit ? dispatch(editTask(newTask)) : dispatch(addTask(newTask));
    closeModal("taskModal");
    setTaskToEditState(null);
  };

  const toggleTag = (tag: string) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleOpenModal = (task?: TaskType) => {
    task ? setTaskToEditState(task) : setTaskToEditState(null);
    openModal("taskModal", { closeWhenClickOutside: true });
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        closeAllModals,
        closeWhenClickOutside,
        handleSaveTask,
        setTaskToEdit: setTaskToEditState,
        handleOpenModal,
        title,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        deadline,
        setDeadline,
        priority,
        setPriority,
        toggleTag,
        taskToEdit,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "ModalContext is undefined. Ensure you are using ModalProvider."
    );
  }
  return context;
};
