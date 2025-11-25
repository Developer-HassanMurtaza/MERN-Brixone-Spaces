import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

type InputFieldProps = {
  placeholder: string;
  icon?: ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  isPassword?: boolean;
};

export const InputField = ({
  placeholder,
  icon,
  type,
  value,
  onChange,
  label,
  isPassword = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ width: "100%", mb: "14px" }}>
      <Typography sx={{ mb: "6px", fontWeight: 600, fontSize: 14 }}>
        {label ?? placeholder}
      </Typography>

      <TextField
        fullWidth
        placeholder={placeholder}
        type={
          isPassword ? (showPassword ? "text" : "password") : type || "text"
        }
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiInputBase-input": {
            padding: { xs: "8px 10px", md: "12px 14px" },
            fontSize: { xs: "14px", md: "16px" },
          },
          "& .MuiOutlinedInput-root": {
            height: { xs: "38px", md: "50px" },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#676767",
            opacity: 1,
          },
        }}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,

          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
    </Box>
  );
};
