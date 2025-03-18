import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { JSX } from "react";

interface DrawerInterface {
  openDrawer: boolean;
  handleCloseDrawer: () => void;
  linkList: {
    buttonText: string;
    linkIcon: JSX.Element;
    redirectTo?: string;
    bottom?: boolean;
    buttonAction?: () => any;
  }[];
}

export default function AppbarDrawer({
  openDrawer,
  handleCloseDrawer,
  linkList,
}: DrawerInterface) {
  return (
    <Drawer anchor="left" open={openDrawer} onClose={handleCloseDrawer}>
      <Box width="250px" height="100%" marginTop="20px">
        <List sx={{ height: "100%" }}>
          {linkList?.length > 0 &&
            linkList.map((link) =>
              link.redirectTo ? (
                <Link
                  href={link.redirectTo}
                  style={{ textDecoration: "none", color: "black" }}
                  onClick={handleCloseDrawer}
                  key={`${link.buttonText}-link`}
                >
                  <Divider component="li" />
                  <ListItemButton
                    sx={
                      link.bottom
                        ? {
                            position: "absolute",
                            bottom: "8%",
                            width: "100%",
                          }
                        : {}
                    }
                  >
                    <ListItemIcon>{link.linkIcon}</ListItemIcon>
                    <ListItemText primary={`${link.buttonText}`} />
                  </ListItemButton>
                </Link>
              ) : (
                <ListItemButton
                  key={link.buttonText}
                  onClick={link?.buttonAction}
                  sx={
                    link.bottom
                      ? { position: "absolute", bottom: "8%", width: "100%" }
                      : {}
                  }
                >
                  <ListItemIcon>{link.linkIcon}</ListItemIcon>
                  <ListItemText primary={link.buttonText} />
                </ListItemButton>
              )
            )}
          <Divider />
        </List>
      </Box>
    </Drawer>
  );
}
