import React from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { TaskType } from "../../features/tasks/tasksSlice";
import { useTranslation } from "react-i18next";
import {
  getChangeLabel,
  getLocalizedValue,
  translateTags,
} from "../utils/languageUtils";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 6,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

type HistoryModalType = {
  taskToHistory: TaskType;
  onClose: () => void;
};

const HistoryModal: React.FC<HistoryModalType> = ({
  taskToHistory,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography
            id="modal-title"
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            🕒 {t("history")}
          </Typography>
          <Box>
            <Typography id="modal-description" variant="subtitle1" gutterBottom>
              {taskToHistory.title}
            </Typography>
            <Typography
              id="modal-description2"
              variant="subtitle2"
              gutterBottom
            >
              {t("created")}: {taskToHistory.timestampCreateTask}
            </Typography>
          </Box>
          <Button
            style={{ marginBottom: "10px" }}
            variant="outlined"
            color="error"
            size="small"
            onClick={onClose}
          >
            X
          </Button>
        </Box>

        {taskToHistory.history && taskToHistory.history.length > 0 ? (
          <Box>
            {taskToHistory.history.map((entry, index) => (
              <React.Fragment key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    mb: 2,
                    bgcolor: "background.default",
                    boxShadow: 1,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {entry.timestamp}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {entry.changes.map((change, changeIndex) => {
                        const [field, values] = change.split(": ");
                        let [oldValue, newValue] = values.split(" → ");
                        if (field === "tags") {
                          oldValue = translateTags(oldValue, t);
                          newValue = translateTags(newValue, t);
                        } else {
                          oldValue = getLocalizedValue(oldValue, t);
                          newValue = getLocalizedValue(newValue, t);
                        }
                        return (
                          <Typography
                            key={changeIndex}
                            variant="body2"
                            color="text.primary"
                            component="li"
                            sx={{ mb: 0.5 }}
                          >
                            {getChangeLabel(change, t)}: {oldValue} → {newValue}
                          </Typography>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
                {taskToHistory.history &&
                  index < taskToHistory.history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {t("noHistory")}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HistoryModal;
