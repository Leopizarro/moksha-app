import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import SignUpForm from "../components/sign-up-form/SignUpForm";

export const metadata = {
    title: 'Sign up',
    description: 'Simple photo gallery created with NextJs'
  };

const SignUp: React.FC = () => {
    return (
        <Grid container alignContent='center' justifyContent='center' sx={{marginTop: '40px'}}>
        <Card>
            <Grid container justifyContent='center' sx={{marginTop: '10px'}}>
                <Typography>Crear Usuario</Typography>
            </Grid>
            <CardContent>
                <Grid container alignContent='center' justifyContent='center'>
                    <SignUpForm />
                </Grid>
            </CardContent>
        </Card>
        </Grid>
    )
}

export default SignUp;