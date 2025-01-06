import { useRef, useState } from "react";
import styled from "styled-components";
import {
  DEFERRED_MODAL_ID,
  TASK_MODAL_ID,
  EXPIRED_MODAL_ID,
  useModal,
} from "../contexts/ModalContext";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../contexts/ThemesContext";
import useClickOutside from "./utils/otsideClick";

const MenuWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    padding-top: 12px;
  }
`;

const HamburgerButton = styled.button<{ theme: string }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#000")};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean; theme: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${(props) => (props.theme === "dark" ? "#333" : "white")};
  background-color: ${({ theme }) => (theme === "light" ? "#fff" : "#222")};
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#000")};
  border: 1px solid ${(props) => (props.theme === "dark" ? "#555" : "#ccc")};
  border-radius: 8px;
  box-shadow: 0 4px 6px
    ${({ theme }) =>
      theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.5)"};
  padding: 10px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 10;
  width: 120px;
  font-size: 12px;
  @media (max-width: 768px) {
    width: 120px;
    right: auto;
    left: 0;
  }
`;

const MenuItem = styled.button<{ theme: string }>`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  color: ${(props) => (props.theme === "dark" ? "#fff" : "#000")};

  &:hover {
    background: ${(props) => (props.theme === "dark" ? "#444" : "#f0f0f0")};
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { openModal } = useModal();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  useClickOutside(menuRef, closeMenu);
  return (
    <MenuWrapper ref={menuRef}>
      <HamburgerButton
        theme={theme}
        onClick={toggleMenu}
        onMouseEnter={toggleMenu}
      >
        ☰
      </HamburgerButton>
      <DropdownMenu onMouseLeave={closeMenu} theme={theme} isOpen={isOpen}>
        <MenuItem
          theme={theme}
          onClick={() => {
            openModal(TASK_MODAL_ID, {
              title: t("newTask"),
              button: t("buttonAdd"),
            });
            closeMenu();
          }}
        >
          {t("addTask")}
        </MenuItem>
        <MenuItem
          theme={theme}
          onClick={() => {
            openModal(DEFERRED_MODAL_ID, {});
            closeMenu();
          }}
        >
          {t("deferredTask")}
        </MenuItem>
        <MenuItem
          theme={theme}
          onClick={() => {
            openModal(EXPIRED_MODAL_ID, {});
            closeMenu();
          }}
        >
          {t("expiredTask")}
        </MenuItem>
      </DropdownMenu>
    </MenuWrapper>
  );
};

export default HamburgerMenu;
