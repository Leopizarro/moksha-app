"use client"
import { createUser } from "../../lib/auth";
import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import GenericSnackbar from "../common/alert/GenericSnackbar";

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertObject, setAlertObject] = useState({ open: false, severity: '', message: ''});

    const handleCloseAlert = () => {
        setAlertObject({ open: false, severity: '', message: ''});
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await createUser(email, password)
        if (response?.ok) {
            setAlertObject({
                open: true,
                message: 'User created successfully!',
                severity: 'success'
            })
        } else {
            setAlertObject({
                open: true,
                message: response?.message,
                severity: 'error'
            })
        }
    }
    const disableButton = password.length < 6 || email.length < 1 || !email.includes('@')
    return (
        <form onSubmit={handleSubmit}>
            <Grid item sx={{marginTop: '10px'}}>
                <TextField label="Email" required type="email" onChange={(e) => setEmail(e.target.value)} inputProps={{ "data-testid": "email" }}/>
            </Grid>
            <Grid item sx={{marginTop: '10px'}}>
                <TextField label="Password" required type="password" onChange={(e) => setPassword(e.target.value)} inputProps={{ "data-testid": "password" }}/>                  
            </Grid>
            <Grid container justifyContent='center' sx={{marginTop: '10px'}}>
                <Button type="submit" variant="outlined" disabled={disableButton}>Crear usuario</Button>           
            </Grid>
            <GenericSnackbar open={alertObject?.open} handleCloseAlert={handleCloseAlert} message={alertObject?.message} severity={alertObject?.severity}/>
        </form>
    );
};

export default SignUpForm;