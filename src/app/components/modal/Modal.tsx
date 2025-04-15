import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface ModalInterface {
  isLoading?: boolean;
  openModal: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  dialogMessage: string;
}

export default function Modal({
  isLoading,
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
      <DialogActions sx={{ justifyContent: isLoading ? "center" : "end" }}>
        {!isLoading && (
          <>
            <Button autoFocus onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar</Button>
          </>
        )}
        {isLoading && (
          <Box>
            <CircularProgress />
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
