import type { ReactNode } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

type AuthCardProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export const AuthCard = ({ children, title, description }: AuthCardProps) => {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "549px", md: "549px" },
        borderRadius: "15px",
        py: { xs: "24px", sm: "32px", md: "37px" },
        px: { xs: "20px", sm: "24px", md: "28px" },
        mx: { xs: 0, sm: "20px", md: 0 },
        boxSizing: "border-box",
      }}
    >
      <CardHeader
        sx={{ p: 0, mb: "20px" }}
        title={
          <Typography
            sx={{ boxSizing: "border-box", fontWeight: "bold" }}
            variant="h6"
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography
            sx={{ boxSizing: "border-box", color: "gray" }}
            variant="body2"
          >
            {description}
          </Typography>
        }
      />
      <CardContent
        sx={{
          p: 0,
          maxHeight: { xs: "none", md: "calc(100vh - 200px)" },
          overflowY: "auto",
          "&:last-child": {
            paddingBottom: 0,
          },
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};
