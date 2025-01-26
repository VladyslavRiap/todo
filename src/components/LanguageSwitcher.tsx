import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useThemeContext } from "../contexts/ThemesContext";
import { Button } from "./utils/commonStyles";
import useClickOutside from "./utils/otsideClick";
import { useNavigate, useParams } from "react-router-dom";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Menu = styled.ul<{ theme: string; $isOpen: boolean }>`
  position: absolute;
  top: 60%;
  left: 0;
  background-color: ${({ theme }) => (theme === "light" ? "#fff" : "#222")};
  color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
  border: 1px solid ${({ theme }) => (theme === "light" ? "#ccc" : "#555")};
  border-radius: 8px;
  box-shadow: 0 4px 6px
    ${({ theme }) =>
      theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.5)"};
  padding: 10px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 10;
  width: 120px;
  font-size: 14px;
  list-style: none;

  @media (max-width: 768px) {
    width: 120px;
    right: auto;
    left: 0;
  }
`;

const MenuItem = styled.li<{ theme: string }>`
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => (theme === "light" ? "#333" : "#ddd")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme === "light" ? "#f0f0f0" : "#333"};
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const { lang } = useParams<{ lang: string }>();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const changeLanguage = (language: string) => {
    if (lang !== language) {
      i18n.changeLanguage(language);
      navigate(`/${language}`);
      setIsOpen(false);
    }
  };

  const currentLanguage =
    lang === "ru" ? "Русский" : lang === "ukr" ? "Українська" : "English";

  return (
    <Wrapper ref={menuRef}>
      <Button
        $variant={theme === "light" ? "primary" : "secondary"}
        onClick={toggleMenu}
        theme={theme}
      >
        {currentLanguage}
      </Button>
      <Menu $isOpen={isOpen} theme={theme}>
        <MenuItem onClick={() => changeLanguage("en")} theme={theme}>
          English
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("ru")} theme={theme}>
          Русский
        </MenuItem>
        <MenuItem onClick={() => changeLanguage("ukr")} theme={theme}>
          Українська
        </MenuItem>
      </Menu>
    </Wrapper>
  );
};

export default LanguageSwitcher;
