import { Box, Checkbox, FormControlLabel, Stack } from "@mui/material";
import {
  InputField,
  AuthCard,
  TextButton,
  FilledButton,
} from "../../components";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import { AuthLinkPrompt } from "../../components/AuthLinkPrompt";

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
              <InputField
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
              <TextButton
                title="Forgot Password?"
                navigateTo="/forgot-password"
              />
            </Box>
            <FilledButton title="Log In" onClick={() => {}} />
            <AuthLinkPrompt
              message="Don’t have an account?"
              title="Sign Up"
              navigateTo="/signup"
            />
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
