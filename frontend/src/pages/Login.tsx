import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import CustomMuiTextField from "../components/CustomMuiTextField";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import { CustomTextButton } from "../components/CustomTextButton";

export default function Login() {
  const fields = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      isPassword: true,
    },
  ];

  return (
    <AuthLayout>
      <AuthCard
        title="Sign In"
        description="Welcome! Please enter your details"
      >
        <Box>
          <Stack>
            {fields.map((field) => (
              <CustomMuiTextField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                isPassword={field?.isPassword ? true : false}
              />
            ))}
            <Box
              sx={{
                p: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                sx={{
                  p: 0,
                  "& .MuiFormControlLabel-label": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    lineHeight: { xs: 1, sm: 1.5 },
                    whiteSpace: "normal",
                  },
                }}
                control={<Checkbox />}
                label="Remember me"
              />
              <CustomTextButton
                title="Forgot Password?"
                navigateTo="/forgot-password"
              />
            </Box>
            <Button
              sx={{ mt: "40px", mb: "30px", textTransform: "capitalize" }}
              variant="contained"
              size="large"
              fullWidth
            >
              Log In
            </Button>
          </Stack>
        </Box>
        <Typography sx={{ textAlign: "center" }}>
          Don’t have an account?
          <CustomTextButton title="Sign Up" navigateTo="/register" />
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
}
