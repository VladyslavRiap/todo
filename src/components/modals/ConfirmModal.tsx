import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../contexts/ThemesContext";
import { Button, Overlay, Title } from "../utils/commonStyles";

interface ConfirmModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: "dark" | "light";
}

const ModalBox = styled.div<{ theme: string }>`
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 15px;
    max-width: 90%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  return (
    <Overlay id="overlay">
      <ModalBox theme={theme}>
        <Title theme={theme}>{message}</Title>
        <ButtonContainer>
          <Button theme={theme} $variant="secondary" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button theme={theme} $variant="primary" onClick={onConfirm}>
            {t("confirm.confirm")}
          </Button>
        </ButtonContainer>
      </ModalBox>
    </Overlay>
  );
};

export default ConfirmModal;
