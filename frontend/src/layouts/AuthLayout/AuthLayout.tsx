import React from "react";
import { Box, Grid } from "@mui/material";
import logo from "../../assets/images/logo.png";
import houseBg from "../../assets/images/house-bg.png";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${houseBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid container>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            height: "100vh",
            display: { xs: "none", sm: "none", md: "flex" },
            alignItems: "center",
            p: { xs: 5, sm: 10 },
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: {
                xs: "70%",
                sm: "70%",
                md: "40%",
              },
            }}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, sm: 3, md: 2 },
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "549px", md: "549px" },
              height: "auto",
              maxHeight: { xs: "100%", md: "100vh" },
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: { xs: "flex-start", md: "center" },
              py: { xs: 2, md: 0 },
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
