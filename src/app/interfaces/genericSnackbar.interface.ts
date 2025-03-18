export interface SnackbarInterface {
  open: boolean;
  severity: "error" | "info" | "success" | "warning";
  message: string;
}
