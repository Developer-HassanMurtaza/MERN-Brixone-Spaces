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
      <Grid container sx={{ height: "100%" }}>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            paddingLeft: { xs: "20px", md: "60px" },
          }}
        >
          <img src={logo} alt="logo" style={{ width: "30%" }} />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
