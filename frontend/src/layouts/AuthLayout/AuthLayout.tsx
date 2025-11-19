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
        height: { xs: "auto", md: "100vh" },
        backgroundImage: `url(${houseBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid container sx={{ minHeight: "100vh" }}>
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
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
