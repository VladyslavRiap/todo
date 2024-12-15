import { PersistConfig } from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  whitelist: ["tasks", "columns"],
};

export default persistConfig;
