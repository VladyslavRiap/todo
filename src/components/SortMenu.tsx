import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../contexts/ThemesContext";

type SortMenuProps = {
  onSort: (order: "lowToHigh" | "highToLow" | "reset") => void;
  theme?: string;
};

const SortMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 80%;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const SortMenuContainer = styled.div<{ theme: string }>`
  display: flex;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  background-color: ${(props) =>
    props.theme === "light" ? "#f5f5f5" : "#333"};
  color: ${(props) => (props.theme === "light" ? "#757575" : "#fff")};
  border-radius: 6px;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#e0e0e0" : "#444"};
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const Menu = styled.div<{ open: boolean; theme: string }>`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 60%;
  transform: translateX(-50%);
  background-color: ${(props) =>
    props.theme === "light" ? "#fff" : "#2c2c2c"};
  border: 1px solid ${(props) => (props.theme === "light" ? "#ddd" : "#444")};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 100123123213;
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: 100px;
    left: 0;

    transform: translateX(0);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const MenuItem = styled.div<{ theme: string }>`
  padding: 12px 16px;
  cursor: pointer;
  color: ${(props) => (props.theme === "light" ? "#333" : "#fff")};
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: ${(props) =>
      props.theme === "light" ? "#f5f5f5" : "#444"};
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const SortMenu: React.FC<SortMenuProps> = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  const handleMenuToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSort = (order: "lowToHigh" | "highToLow" | "reset") => {
    onSort(order);
    setIsOpen(false);
  };

  return (
    <SortMenuWrapper>
      <SortMenuContainer theme={theme} onClick={handleMenuToggle}>
        {t("sort")}
      </SortMenuContainer>
      <Menu open={isOpen} theme={theme}>
        <MenuItem onClick={() => handleSort("lowToHigh")} theme={theme}>
          {t("sortLowToHigh")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("highToLow")} theme={theme}>
          {t("sortHighToLow")}
        </MenuItem>
        <MenuItem onClick={() => handleSort("reset")} theme={theme}>
          {t("reset")}
        </MenuItem>
      </Menu>
    </SortMenuWrapper>
  );
};

export default SortMenu;
