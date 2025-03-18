"use client";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import { menuOptionsInterface } from "../../interfaces/app-header/appHeader.interface";
import classes from "./appbar.module.css";
import Image from "next/image";
import mmLogo from "../../../../public/mm-app-logo.jpg";
import { Aleo } from "next/font/google";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { AppBarInterface } from "../../interfaces/banner.interface";
import MenuIcon from "@mui/icons-material/Menu";
import AppbarDrawer from "./AppbarDrawer";

const aleo = Aleo({ subsets: ["latin"] });

const drawerLinks = [
  {
    buttonText: "Productos",
    redirectTo: "/admin",
    linkIcon: <FormatListBulletedIcon />,
  },
  {
    buttonText: "Añadir producto",
    redirectTo: "/upload",
    linkIcon: <AddIcon />,
  },
  {
    buttonText: "Cerrar Sesión",
    linkIcon: <LogoutIcon />,
    buttonAction: () => signOut(),
    bottom: true,
  },
];

const AppHeaderLink: React.FC<AppBarInterface> = (props) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { data: session } = useSession();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const { menuOptions } = props;
  const pathname = usePathname();
  return (
    <Toolbar className={classes.toolbar}>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={session ? 5 : 5}
          sm={4}
          md={3}
          sx={{ display: "inline-flex" }}
        >
          {session && (
            <IconButton
              onClick={() => setOpenDrawer((prev) => !prev)}
              sx={{
                color: "black",
                "& .MuiButton-startIcon": { marginRight: "4px" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box className={classes.headerLogo}>
            <Image
              fill
              alt="mm-app-logo"
              src={mmLogo}
              style={{
                objectFit: "contain", // cover, contain, none
              }}
            />
          </Box>
          <Box className={`${classes.headerLogoTitle} ${aleo.className}`}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
              }}
            >
              Mandalas Moksha
            </Link>
          </Box>
        </Grid>
        <Grid item xs={session ? 7 : 7} sm={8} md={9}>
          <Grid container justifyContent="right">
            {menuOptions.map((linkObject: menuOptionsInterface, i: number) => (
              <div style={{ display: "flex" }} key={i}>
                <Link
                  href={linkObject.redirectPath}
                  key={linkObject.text}
                  data-testid={linkObject.dataTestId}
                >
                  {
                    <Button
                      key={linkObject.text}
                      className={classes.startIconButton}
                      startIcon={linkObject.icon}
                      sx={{
                        color: "black",
                        backgroundColor:
                          pathname === linkObject.redirectPath
                            ? "grey"
                            : "none",
                        "& .MuiButton-startIcon": { marginRight: "4px" },
                      }}
                    >
                      {isXs && linkObject?.mobileText
                        ? linkObject?.mobileText
                        : linkObject.text}
                    </Button>
                  }
                </Link>

                {linkObject.last ? (
                  ""
                ) : (
                  <Divider orientation="vertical" variant="middle" flexItem />
                )}
              </div>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <AppbarDrawer
        openDrawer={openDrawer}
        handleCloseDrawer={() => setOpenDrawer(false)}
        linkList={drawerLinks}
      />
    </Toolbar>
  );
};

export default AppHeaderLink;
