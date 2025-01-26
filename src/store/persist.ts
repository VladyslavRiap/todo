import { PersistConfig } from "redux-persist";
import storage from "redux-persist/es/storage";

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  whitelist: ["columns", "tasks"],
};

export default persistConfig;
