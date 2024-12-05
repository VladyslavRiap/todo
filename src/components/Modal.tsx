import React, { useEffect, useState } from "react";
import { TaskType } from "../features/tasks/tasksSlice";
import { v1 } from "uuid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskType) => void;
  taskToEdit?: TaskType | null;
}

const predefinedTags = ["Work", "Private", "Studying", "Shopping"];

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

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

  if (!isOpen) return null;

  const handleSave = () => {
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
    onSave(newTask);
    onClose();
  };

  const toggleTag = (tag: string) => {
    debugger;
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{taskToEdit ? "Edit Task" : "Add New Task"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
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
          <button type="submit">{taskToEdit ? "editTask" : "Save Task"}</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
