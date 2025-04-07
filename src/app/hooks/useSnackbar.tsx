import { useState } from "react";
import { SnackbarInterface } from "../interfaces/genericSnackbar.interface";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

export function useSnackbar() {
  const [alertObject, setAlertObject] = useState<SnackbarInterface>({
    open: false,
    severity: "success",
    message: "",
  });

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertObject((prev) => ({ ...prev, open: false }));
  };

  const SnackbarComponent = (
    <Snackbar
      open={alertObject.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      data-testid="snackbar"
    >
      <Alert
        onClose={handleClose}
        severity={alertObject.severity}
        variant="filled"
        sx={{ width: "100%" }}
        data-testid="alert"
      >
        {alertObject.message}
      </Alert>
    </Snackbar>
  );
  return { setAlertObject, SnackbarComponent };
}
