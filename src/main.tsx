import { createRoot } from "react-dom/client";
import "./index.css";
import App2 from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ModalProvider } from "./contexts/ModalContext";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ModalProvider>
      <App2 />
    </ModalProvider>
  </Provider>
);
