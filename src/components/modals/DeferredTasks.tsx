import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, useAppDispatch } from "../../store/store";
import { fetchTodos, restoreTaskApi } from "../../features/tasks/tasksSlice";
import { useThemeContext } from "../../contexts/ThemesContext";
import { useTranslation } from "react-i18next";
import {
  CloseButton,
  ModalBox,
  Overlay,
  Header,
  Title,
  TaskList,
  TaskItem,
  TaskDescription,
  TaskInfo,
  TagContainer,
  Tag,
  TaskTitle,
  RestoreButton,
  Footer,
} from "../utils/commonStyles";
type DeferredTasksType = {
  onClose: () => void;
};

const DeferredTasks: React.FC<DeferredTasksType> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const deferredTasks = useSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.status === "deferred")
  );
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  return (
    <Overlay id="overlay">
      <ModalBox theme={theme}>
        <Header>
          <Title theme={theme}>{t("deferredTasks")}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <TaskList>
          {deferredTasks.map((task) => (
            <TaskItem key={task.id} theme={theme}>
              <TaskTitle theme={theme}>{task.title}</TaskTitle>
              {task.description && (
                <TaskDescription theme={theme}>
                  {t("description")}: {task.description}
                </TaskDescription>
              )}
              {task.deadline && (
                <TaskInfo theme={theme}>
                  <strong>{t("deadline")}: </strong>
                  {task.deadline}
                </TaskInfo>
              )}
              {task.deferredDate && (
                <TaskInfo theme={theme}>
                  <strong>{t("deferredDate")}: </strong>
                  {task.deferredDate}
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
              <Footer>
                <RestoreButton
                  theme={theme}
                  onClick={() => dispatch(restoreTaskApi(task.id))}
                >
                  {t("Restoretask")}
                </RestoreButton>
              </Footer>
            </TaskItem>
          ))}
        </TaskList>
      </ModalBox>
    </Overlay>
  );
};

export default DeferredTasks;
