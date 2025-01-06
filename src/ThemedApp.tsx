import React, { useMemo } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { useThemeContext } from "./contexts/ThemesContext";
import { ModalProvider } from "./contexts/ModalContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { darkTheme, lightTheme } from "./themes/themes";
import { SnackbarProviderWithContext } from "./contexts/SnackBarContext";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    margin: 0;
    font-family: Arial, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

const ThemedApp: React.FC = () => {
  const { theme } = useThemeContext();

  const currentTheme = useMemo(
    () => (theme === "light" ? lightTheme : darkTheme),
    [theme]
  );

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <SnackbarProvider maxSnack={3}>
        <SnackbarProviderWithContext>
          <ModalProvider>
            <DndProvider backend={HTML5Backend}>
              <App />
            </DndProvider>
          </ModalProvider>
        </SnackbarProviderWithContext>
      </SnackbarProvider>
    </StyledThemeProvider>
  );
};

export default ThemedApp;
