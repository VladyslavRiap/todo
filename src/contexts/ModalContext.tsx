import { createContext, ReactNode, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask, TaskType } from "../features/tasks/tasksSlice";
import TaskModal from "../components/modals/TaskModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import HistoryModal from "../components/modals/HistoryModal";
import TaskModalView from "../components/modals/TaskModalView";
import DefferedTasks from "../components/modals/DeferredTasks";
import ExpiredTasks from "../components/modals/ExpiredTasks";

export const TASK_MODAL_ID = "taskModal";
export const CONFIRM_MODAL_ID = "confirmModal";
export const HISTORY_MODAL_ID = "historyModal";
export const TASK_MODAL_VIEW_ID = "taskModalView";
export const DEFERRED_MODAL_ID = "deferredModal";
export const EXPIRED_MODAL_ID = "expiredModal";
export const modalsLookUp: { [key: string]: React.FC<any> } = {
  [TASK_MODAL_ID]: TaskModal,
  [CONFIRM_MODAL_ID]: ConfirmModal,
  [HISTORY_MODAL_ID]: HistoryModal,
  [TASK_MODAL_VIEW_ID]: TaskModalView,
  [DEFERRED_MODAL_ID]: DefferedTasks,
  [EXPIRED_MODAL_ID]: ExpiredTasks,
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
    setModal((prev) => [...prev, { name, options }]);
  };

  const closeModal = (name: string) => {
    setModal((prev) => prev.filter((modal) => modal.name !== name));
  };

  const addTaskToList = (task: TaskType, taskToEdit?: TaskType | null) => {
    if (taskToEdit) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }
    closeModal(TASK_MODAL_ID);
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>,
    name: string
  ) => {
    if ((e.target as HTMLElement).id === "overlay") {
      closeModal(name);
    }
  };

  return (
    <ModalContext.Provider
      value={{ taskToEdit, addTaskToList, modal, openModal, closeModal }}
    >
      {children}
      {modal.map((modal, index) => {
        const ModalComponent = modalsLookUp[modal.name];
        return (
          <div
            id="overlay"
            key={index}
            onClick={(e) => handleOverlayClick(e, modal.name)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10001,
            }}
          >
            <ModalComponent
              onClose={() => closeModal(modal.name)}
              {...modal.options}
            />
          </div>
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
