import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ModalProvider } from "./contexts/ModalContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ModalProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </ModalProvider>
  </Provider>
);
