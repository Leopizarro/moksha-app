import { AppBar } from "@mui/material";
import React from "react";
import { menuOptionsInterface } from "../../interfaces/app-header/appHeader.interface";
import AppHeaderLink from "./AppbarLinks";

const AppHeader: React.FC = () => {
  const menuOptions: menuOptionsInterface[] = [
    /* {
      text: 'PEDIDOS PERSONALIZADOS',
      mobileText: 'PEDIDOS',
      redirectPath: '/custom-projects',
      last: false,
      dataTestId: "custom-projects-redirect-link",
    },
    {
      text: 'ACERCA DE',
      redirectPath: '/about',
      last: true,
      dataTestId: "about-redirect-link",
    }, */
  ];
  return (
    <AppBar position="static">
      <AppHeaderLink menuOptions={menuOptions} />
    </AppBar>
  );
};

export default AppHeader;
