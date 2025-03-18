"use client";
import { Button, Grid, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import GenericSnackbar from "../common/alert/GenericSnackbar";
import { SnackbarInterface } from "@/app/interfaces/genericSnackbar.interface";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackQueryParam = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertObject, setAlertObject] = useState<SnackbarInterface>({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseAlert = () => {
    setAlertObject({ open: false, severity: "success", message: "" });
  };

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (signInResponse?.ok && signInResponse?.status === 200) {
      router.push(callbackQueryParam || "/");
    } else {
      setAlertObject({
        open: true,
        severity: "error",
        message: "Credenciales Incorrectas, intente nuevamente",
      });
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <Grid container textAlign="center">
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <TextField
            label="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ "data-testid": "email" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <TextField
            label="Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ "data-testid": "password" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            sx={{ margin: "0px 5px" }}
          >
            Volver
          </Button>
          <Button
            size="small"
            variant="outlined"
            type="submit"
            sx={{ margin: "0px 5px" }}
          >
            Login
          </Button>
        </Grid>
      </Grid>
      <GenericSnackbar
        open={alertObject?.open}
        handleCloseAlert={handleCloseAlert}
        message={alertObject?.message}
        severity={alertObject?.severity}
      />
    </form>
  );
};

export default LoginForm;
