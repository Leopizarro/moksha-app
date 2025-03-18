import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

interface GenericSnackbarInterface {
  open: boolean;
  handleCloseAlert: () => void;
  message: string;
  severity: "error" | "info" | "success" | "warning";
}

const GenericSnackbar: React.FC<GenericSnackbarInterface> = (props) => {
  const { open, handleCloseAlert, message, severity } = props;

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    handleCloseAlert();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      data-testid="snackbar"
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
        data-testid="alert"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GenericSnackbar;
