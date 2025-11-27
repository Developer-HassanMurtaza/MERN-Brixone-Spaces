import { Avatar, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

// ╔═════════════════════╗
// ║     Props Types     ║
// ╚═════════════════════╝
type MuiContactCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  mb?: number;
};

// ╔════════════════════════╗
// ║     MuiContactCard     ║
// ╚════════════════════════╝
export const MuiContactCard = ({
  icon,
  label,
  value,
  mb = 2.5,
}: MuiContactCardProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb,
      }}
    >
      <Avatar
        sx={{
          bgcolor: "#F5F5F5",
          width: "2.5rem",
          height: "2.5rem",
          mr: 1.5,
          alignSelf: "center",
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "black", mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
