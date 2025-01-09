import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useThemeContext } from "../contexts/ThemesContext";
import { styled } from "styled-components";

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme.mode === "light" ? "#f0f0f0" : "#333"};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.mode === "light" ? "#e0e0e0" : "#444"};
    transform: scale(1.1);
  }
`;

const ThemeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#f0f0f0")};
  transition: color 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }
`;
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <ThemeToggleContainer onClick={toggleTheme}>
      <ThemeIcon>
        {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
      </ThemeIcon>
    </ThemeToggleContainer>
  );
};

export default ThemeToggle;
