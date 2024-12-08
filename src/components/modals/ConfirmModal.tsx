import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";

interface ConfirmModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open
      onClose={onCancel}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, width: 200 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {message}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={onCancel} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
