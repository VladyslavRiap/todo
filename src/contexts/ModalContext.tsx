import { createContext, ReactNode, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask, TaskType } from "../features/tasks/tasksSlice";
import TaskModal from "../components/modals/TaskModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import HistoryModal from "../components/modals/HistoryModal";
export const TASK_MODAL_ID = "taskModal";
export const CONFIRM_MODAL_ID = "confirmModal";
export const HISTORY_MODAL_ID = "historyModal";
export const modalsLookUp: { [key: string]: React.FC<any> } = {
  [TASK_MODAL_ID]: TaskModal,
  [CONFIRM_MODAL_ID]: ConfirmModal,
  [HISTORY_MODAL_ID]: HistoryModal,
};
interface ModalContextValue {
  modal: { name: string; options: Record<string, any> }[];
  openModal: (name: string, options: Record<string, any>) => void;
  closeModal: (name: string) => void;
  addTaskToList: (task: TaskType, taskToEdit?: TaskType | null) => void;
  taskToEdit: TaskType | null;
}
const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = useState<ModalContextValue["modal"]>([]);
  const [taskToEdit, setTaskToEditState] = useState<TaskType | null>(null);
  const dispatch = useDispatch();
  const openModal = (name: string, options: Record<string, any>) => {
    setModal((prev: any) => [...prev, { name, options }]);
  };
  const closeModal = (name: string) => {
    setModal((prev: any) => prev.filter((modal: any) => modal.name !== name));
  };

  const addTaskToList = (task: TaskType, taskToEdit?: TaskType | null) => {
    if (taskToEdit) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }
    closeModal(TASK_MODAL_ID);
  };

  return (
    <ModalContext.Provider
      value={{ taskToEdit, addTaskToList, modal, openModal, closeModal }}
    >
      {children}{" "}
      {modal.map((modal, index) => {
        const ModalComponent = modalsLookUp[modal.name];
        return (
          <ModalComponent
            key={index}
            onClose={() => closeModal(modal.name)}
            {...modal.options}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
