import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { ModalProvider } from "./contexts/ModalContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ModalProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </ModalProvider>
    </PersistGate>
  </Provider>
);
