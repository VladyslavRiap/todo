import React, { useRef } from "react";
import { useModal } from "../contexts/ModalContext";

interface ModalProps {}

const predefinedTags = ["Work", "Private", "Studying", "Shopping"];

const Modal: React.FC<ModalProps> = () => {
  const modalContext = useModal();
  const {
    modals,
    closeModal,
    handleSaveTask,
    title,
    setTitle,
    description,
    setDescription,
    tags,
    deadline,
    setDeadline,
    priority,
    setPriority,
    toggleTag,
    taskToEdit,
  } = modalContext;

  const currentModal = modals.length > 0 ? modals[0] : null;
  const isOpen = !!currentModal;

  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !currentModal) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal-content" ref={modalRef}>
        <span
          className="close"
          onClick={() => currentModal && closeModal(currentModal.id)}
        >
          &times;
        </span>
        <h2>{taskToEdit ? "Edit Task" : "Add New Task"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveTask();
          }}
        >
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          <label>
            Tags:
            <div>
              {predefinedTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={tags.includes(tag) ? "tag selected" : "tag"}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </label>
          <label>
            Deadline:
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
          <label>
            Priority:
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "high" | "medium" | "low")
              }
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <button type="submit">
            {taskToEdit ? "Edit Task" : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
