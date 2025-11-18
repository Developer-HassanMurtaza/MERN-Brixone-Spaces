import type { ReactNode, ChangeEvent } from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";

type InputFieldProps = {
  placeholder: string;
  icon?: ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function InputField({
  placeholder,
  icon,
  type,
  value,
  onChange,
  label,
}: InputFieldProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ mb: 1, fontWeight: 600, fontSize: 14 }}>
        {label ?? placeholder}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        type={type || "text"}
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: "#676767",
            opacity: 1,
          },
        }}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
        }}
      />
    </Box>
  );
}
