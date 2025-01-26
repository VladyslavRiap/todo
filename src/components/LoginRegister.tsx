import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useThemeContext } from "../contexts/ThemesContext";
import { Button } from "./utils/commonStyles";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../store/store";
import { LOGIN_MODAL_ID, useModal } from "../contexts/ModalContext";
import { checkToken, logout } from "../features/auth/authSlice";
import { resetTasks } from "../features/tasks/tasksSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div<{ theme: string }>`
  position: absolute;
  top: 40px;
  width: 80px;
  right: 0;
  background: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 14px;
  }
`;

const LoginRegister: React.FC = () => {
  const { t } = useTranslation(); // Initialize the useTranslation hook
  const { theme } = useThemeContext();
  const isUser = useSelector((state: RootState) => state.auth.user);
  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);

  useEffect(() => {
    if (!isUser) {
      setShowTooltip(false);
    }
  }, [isUser]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetTasks());
  };

  return (
    <Wrapper ref={menuRef}>
      <Button
        $variant={theme === "light" ? "primary" : "secondary"}
        theme={theme}
        onClick={() => {
          if (!isUser) {
            openModal(LOGIN_MODAL_ID, {});
          } else {
            setShowTooltip((prev) => !prev);
          }
        }}
      >
        {isUser === null || isUser === undefined
          ? t("Login")
          : `${isUser.name}`}
      </Button>
      {showTooltip && isUser && (
        <Tooltip theme={theme}>
          <button onClick={handleLogout}>{t("Logout")}</button>
        </Tooltip>
      )}
    </Wrapper>
  );
};

export default LoginRegister;
