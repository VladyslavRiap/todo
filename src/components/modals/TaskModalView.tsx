import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { TaskType } from "../../features/tasks/tasksSlice";
import { useThemeContext } from "../../contexts/ThemesContext";
import {
  ModalBox,
  Overlay,
  CloseButton,
  Header,
  Title,
  TaskDescription,
  TaskInfo,
  TagContainer,
  Tag,
} from "../utils/commonStyles";

interface TaskModalProps {
  task: TaskType | null;
  onClose: () => void;
}

const TaskModalView: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  if (!task) return null;

  return (
    <Overlay id="overlay">
      <ModalBox theme={theme}>
        <Header>
          <Title theme={theme}>{task.title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        {task.description ? (
          <TaskDescription theme={theme}>
            {t("description")}:{task.description}
          </TaskDescription>
        ) : (
          ""
        )}
        {task.deadline && (
          <TaskInfo theme={theme}>
            <strong>{t("deadline")}: </strong>
            {task.deadline}
          </TaskInfo>
        )}
        {task.tags.length > 0 && (
          <TagContainer>
            {task.tags.map((tag) => (
              <Tag key={tag} theme={theme}>
                {t(tag)}
              </Tag>
            ))}
          </TagContainer>
        )}
      </ModalBox>
    </Overlay>
  );
};

export default TaskModalView;
