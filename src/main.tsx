import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import ThemedApp from "./ThemedApp";
import { ThemeProvider } from "./contexts/ThemesContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </I18nextProvider>
    </PersistGate>
  </Provider>
);
