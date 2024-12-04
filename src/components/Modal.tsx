import React, { useState } from "react";
import { TaskType } from "../../features/tasks/tasksSlice";
import { v1 } from "uuid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskType) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim() === "") {
      alert("Title is required");
      return;
    }
    const newTask: TaskType = {
      id: v1(),
      title,
      description,
      tags,
      deadline,
      priority,
      status: "todo",
    };
    onSave(newTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add New Task</h2>
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
            <input
              type="text"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((tag) => tag.trim()))
              }
            />
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
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <button type="submit">Save Task</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
