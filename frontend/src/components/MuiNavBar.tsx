import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { BrixoneBlueLogo, MenuIcon } from "../assets";
import { MuiDrawer } from "./MuiDrawer";

export const MuiNavBar = () => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>("Home");
  const pages = ["Home", "About", "Buy", "Sell", "Invest", "Blog", "Contact"];

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handlePageClick = (page: string) => {
    setActivePage(page);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "inherit" }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: { xs: "space-between" } }}>
          <Box component="img" src={BrixoneBlueLogo} sx={{ width: "7rem" }} />
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "flex",
                md: "flex",
                justifyContent: "center",
              },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{
                  my: 2,
                  color: activePage === page ? "white" : "black",
                  backgroundColor:
                    activePage === page
                      ? theme.palette.primary.main
                      : "transparent",
                  display: "block",
                  "&:hover": {
                    backgroundColor:
                      activePage === page
                        ? theme.palette.primary.main
                        : theme.palette.primary.dark,
                    color: "white",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                mr: "2rem",
                display: { xs: "none", sm: "none", md: "block" },
              }}
            >
              Login
            </Button>
            <IconButton onClick={handleDrawerOpen} sx={{ cursor: "pointer" }}>
              <Box component="img" src={MenuIcon} sx={{ width: "1.7rem" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <MuiDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </Box>
  );
};
