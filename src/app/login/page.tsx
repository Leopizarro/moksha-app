import LoginForm from "../components/login/LoginForm";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { Suspense } from "react";

export const metadata = {
  title: `Login - ${process.env.NEXT_PUBLIC_STORE_NAME}`,
  description: `Iniciar sesión en ${process.env.NEXT_PUBLIC_STORE_NAME}`,
};

const Login: React.FC = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      sx={{ marginTop: "40px" }}
    >
      <Card sx={{ maxWidth: 375 }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 14 }}
            color="text.secondary"
            gutterBottom
            textAlign="center"
          >
            {process.env.NEXT_PUBLIC_STORE_NAME}
          </Typography>
          <Typography variant="h5" component="div" textAlign="center">
            Inicia sesión
          </Typography>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Login;
