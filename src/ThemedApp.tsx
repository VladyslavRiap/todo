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
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LanguageWrapper from "./components/utils/LanguageWrapper";

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
  const getStoredLanguage = () => {
    const savedLang = localStorage.getItem("i18nextLng");
    const supportedLanguages = ["en", "ru", "ukr"];
    return supportedLanguages.includes(savedLang ?? "") ? savedLang : "en";
  };

  return (
    <StyledThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <SnackbarProvider maxSnack={3}>
        <SnackbarProviderWithContext>
          <ModalProvider>
            <DndProvider backend={HTML5Backend}>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Navigate to={`/${getStoredLanguage()}`} replace />
                    }
                  />
                  <Route
                    path=":lang/*"
                    element={
                      <LanguageWrapper>
                        <App />
                      </LanguageWrapper>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </DndProvider>
          </ModalProvider>
        </SnackbarProviderWithContext>
      </SnackbarProvider>
    </StyledThemeProvider>
  );
};

export default ThemedApp;
