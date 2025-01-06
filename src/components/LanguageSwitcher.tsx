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

const Menu = styled.ul<{ theme: string; isOpen: boolean }>`
  position: absolute;
  top: 60%;
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
  list-style-type: none;
  @media (max-width: 768px) {
    width: 120px;
    right: auto;
    left: 0;
  }
`;
const MenuItem = styled.li<{ theme: string }>`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme }) => (theme === "light" ? "#333" : "#ddd")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme === "light" ? "#f0f0f0" : "#333"};
  }
`;

interface LanguageSwitcherProps {
  theme?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = (languageCode: string) => {
    setIsOpen(false);
    if (languageCode !== lang) {
      i18n.changeLanguage(languageCode); // Меняем язык в i18n
      navigate(`/${languageCode}`); // Обновляем URL
    }
  };

  const closeMenuWithOutSave = () => {
    setIsOpen(false);
  };

  const currentLanguage =
    i18n.language === "ru"
      ? "Русский"
      : i18n.language === "ukr"
      ? "Українська"
      : "English";

  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <Wrapper ref={menuRef}>
      <Button
        variant={theme === "light" ? "primary" : "secondary"}
        onMouseEnter={toggleMenu}
        onClick={toggleMenu}
        theme={theme}
      >
        {currentLanguage}
      </Button>
      {isOpen && (
        <Menu onMouseLeave={closeMenuWithOutSave} isOpen={isOpen} theme={theme}>
          <MenuItem onClick={() => closeMenu("en")} theme={theme}>
            English
          </MenuItem>
          <MenuItem onClick={() => closeMenu("ru")} theme={theme}>
            Русский
          </MenuItem>
          <MenuItem onClick={() => closeMenu("ukr")} theme={theme}>
            Українська
          </MenuItem>
        </Menu>
      )}
    </Wrapper>
  );
};

export default LanguageSwitcher;
