import LoginForm from "../components/login/LoginForm";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { Suspense } from "react";

export const metadata = {
  title: 'Login',
  description: 'Simple photo gallery created with NextJs'
};

const Login: React.FC = () => {

    return (
      <Grid container justifyContent='center' alignContent='center' sx={{ marginTop: '40px'}}>
        <Card sx={{ maxWidth: 375 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom textAlign='center'>
          Mandalas Moksha
        </Typography>
        <Typography variant="h5" component="div" textAlign='center'>
          Inicia sesión
        </Typography>
        <Suspense>
          <LoginForm/>
        </ Suspense>
      </CardContent>
    </Card>
    </Grid>
    )
}

export default Login;