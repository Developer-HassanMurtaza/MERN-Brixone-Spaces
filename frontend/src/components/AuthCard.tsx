import type { ReactNode } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

type AuthCardProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export default function AuthCard({
  children,
  title,
  description,
}: AuthCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 549,
        borderRadius: "15px",
        py: "37px",
        px: "28px",
        mx: { xs: "20px", md: "60px" },
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
          "&:last-child": {
            paddingBottom: 0,
          },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
