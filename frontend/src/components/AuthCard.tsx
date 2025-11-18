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
        sx={{ p: 0 }}
        title={
          <Typography sx={{ boxSizing: "border-box" }} variant="h6">
            {title}
          </Typography>
        }
        subheader={
          <Typography sx={{ boxSizing: "border-box" }} variant="body2">
            {description}
          </Typography>
        }
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
