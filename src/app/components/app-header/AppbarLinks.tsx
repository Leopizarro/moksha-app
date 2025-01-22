'use client'
import { Box, Button, Grid, IconButton, Link, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React from "react"
import { menuOptionsInterface } from "../../interfaces/app-header/appHeader.interface";
import classes from './appbar.module.css';
import Image from "next/image";
import mmLogo from '../../../../public/mm-app-logo.jpg';
import { Aleo } from 'next/font/google'
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBarInterface } from "../../interfaces/banner.interface";
 
const aleo = Aleo({ subsets: ['latin'] })

const AppHeaderLink: React.FC<AppBarInterface> = (props) => {
  const { data: session } = useSession();
  const handleLogOut = () => {
    signOut();
  }
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const { menuOptions } = props;
    const pathname = usePathname();
    return (
        <Toolbar className={classes.toolbar}>
          <Grid container justifyContent='center'>
            <Grid item xs={session ? 5 : 5} sm={4} md={3} sx={{ display: 'inline-flex'}}>
              <Box className={classes.headerLogo}>
              <Image
              fill
              alt="mm-app-logo"
              src={mmLogo}
              style={{
                objectFit: 'contain', // cover, contain, none
              }}/>
              </Box>
            <Box className={`${classes.headerLogoTitle} ${aleo.className}`}>
            <Link href="/" style={{ textDecoration: 'none', color: 'black', fontSize: '16px' }}>Mandalas Moksha</Link>
          </Box>
          </Grid>
          <Grid item xs={session ? 7 : 7} sm={8} md={9}>
            <Grid container justifyContent='right'>
          {menuOptions.map((linkObject: menuOptionsInterface, i: number) => (
            <div style={{ display: 'flex'}} key={i}>
              <Link href={linkObject.redirectPath} key={linkObject.text} data-testid={linkObject.dataTestId}>
                {/* isXs && session ? (<IconButton key={linkObject.text} sx={{ color: 'black', margin: '0px 25px', backgroundColor: pathname === linkObject.redirectPath ? 'grey' : 'none'}}>
                {linkObject?.icon}
                </IconButton>) : */ (<Button key={linkObject.text} className={classes.startIconButton} startIcon={linkObject.icon} sx={{ color: 'black', backgroundColor: pathname === linkObject.redirectPath ? 'grey' : 'none', "& .MuiButton-startIcon": { marginRight: "4px" }}}>
                  {isXs && linkObject?.mobileText ? linkObject?.mobileText : linkObject.text} 
                </Button>)}
              </Link>
              <Typography sx={{ margin: '2px 0 0 0', fontSize: '22px', color: 'black'}}>
                {linkObject.last ? '' : '|'}
              </Typography>
            </div>
          ))}
          {session && !isMd && (
            <Button onClick={handleLogOut} sx={{ color: 'black', margin: '0px 5px', fontSize: '14px'}}>Log out</Button>
          )}
          {session && isMd && (<IconButton onClick={handleLogOut} sx={{ color: 'black', "& .MuiButton-startIcon": { marginRight: "4px" }}}>
          <LogoutIcon/>
                </IconButton>)}
          </Grid>
          </Grid>
          </Grid>
        </Toolbar>
)};

export default AppHeaderLink;