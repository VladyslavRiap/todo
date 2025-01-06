import React from "react";
import { useThemeContext } from "../contexts/ThemesContext";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </button>
  );
};

export default ThemeToggleButton;
