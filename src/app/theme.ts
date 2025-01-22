'use client'
import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: { main: '#6200ea' }, // Purple
      secondary: { main: '#03dac6' }, // Teal
      background: { default: '#f5f5f5', paper: '#ffffff' },
    },
    typography: {
      button: { textTransform: 'uppercase' },
    },
});