import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ModalInterface {
  openModal: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  dialogMessage: string;
}

export default function Modal({
  openModal,
  handleCancel,
  handleConfirm,
  dialogMessage,
}: ModalInterface) {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": { width: "80%", maxHeight: 435 },
        zIndex: 99,
      }}
      maxWidth="xs"
      open={openModal}
    >
      <DialogTitle>Confirmar Acción</DialogTitle>
      <DialogContent dividers>
        <Typography>{dialogMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}
