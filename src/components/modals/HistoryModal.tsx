import React from "react";
import styled from "styled-components";
import { TaskType } from "../../features/tasks/tasksSlice";
import { useTranslation } from "react-i18next";
import {
  getChangeLabel,
  getLocalizedValue,
  translateTags,
} from "../utils/languageUtils";
import { useThemeContext } from "../../contexts/ThemesContext";
import { ModalBox, Overlay, CloseButton, Header } from "../utils/commonStyles";

type HistoryModalType = {
  taskToHistory: TaskType;
  onClose: () => void;
};

const Title = styled.h2<{ theme: string }>`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SubTitle = styled.p<{ theme: string }>`
  font-size: 14px;
  color: ${({ theme }) => (theme === "dark" ? "#bbb" : "#666")};
  margin: 4px 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const HistoryList = styled.div`
  margin-top: 16px;

  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const HistoryCard = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#444" : "#f9f9f9")};
  border: 1px solid ${({ theme }) => (theme === "dark" ? "#555" : "#ddd")};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Timestamp = styled.p<{ theme: string }>`
  font-size: 12px;
  color: ${({ theme }) => (theme === "dark" ? "#aaa" : "#666")};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const ChangeItem = styled.li<{ theme: string }>`
  font-size: 14px;
  color: ${({ theme }) => (theme === "dark" ? "#ddd" : "#333")};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ConfirmButton = styled.button<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#f44336" : "#f44336")};
  color: #fff;
  font-size: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => (theme === "dark" ? "#d32f2f" : "#d32f2f")};
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const HistoryModal: React.FC<HistoryModalType> = ({
  taskToHistory,
  onClose,
}) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  return (
    <Overlay id="overlay">
      <ModalBox theme={theme}>
        <Header>
          <div>
            <Title theme={theme}>🕒 {t("history")}</Title>
            <SubTitle theme={theme}>{taskToHistory.title}</SubTitle>
            <SubTitle theme={theme}>
              {t("created")}: {taskToHistory.timestampCreateTask}
            </SubTitle>
          </div>
          <CloseButton theme={theme} onClick={onClose}>
            &times;
          </CloseButton>
        </Header>

        {taskToHistory.history && taskToHistory.history.length > 0 ? (
          <HistoryList>
            {taskToHistory.history.map((entry, index) => (
              <HistoryCard key={index} theme={theme}>
                <Timestamp theme={theme}>{entry.timestamp}</Timestamp>
                <ul>
                  {entry.changes.map((change, changeIndex) => {
                    const [field, values] = change.split(/:\s(.+)/);
                    let [oldValue, newValue] = values.split(" → ");

                    if (field === "tags") {
                      oldValue = oldValue ? translateTags(oldValue, t) : "";
                      newValue = newValue ? translateTags(newValue, t) : "";
                    } else {
                      oldValue = getLocalizedValue(oldValue, t, field);
                      newValue = getLocalizedValue(newValue, t, field);
                    }

                    if (oldValue || newValue) {
                      return (
                        <ChangeItem key={changeIndex} theme={theme}>
                          {getChangeLabel(field, t)}: {oldValue} → {newValue}
                        </ChangeItem>
                      );
                    }
                    return null;
                  })}
                </ul>
              </HistoryCard>
            ))}
          </HistoryList>
        ) : (
          <SubTitle theme={theme}>{t("noHistory")}</SubTitle>
        )}

        <Footer>
          <ConfirmButton theme={theme} onClick={onClose}>
            {t("close")}
          </ConfirmButton>
        </Footer>
      </ModalBox>
    </Overlay>
  );
};

export default HistoryModal;
