import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";

type PasswordFieldProps = {
  placeholder: string;
  icon?: ReactNode;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordField({
  placeholder,
  icon,
  value,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
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
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((s) => !s)}
              edge="end"
            >
              {showPassword ? "Hide" : "Show"}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
