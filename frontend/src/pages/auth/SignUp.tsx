import { Box, Stack, Typography } from "@mui/material";
import {
  AuthCard,
  InputField,
  TextButton,
  FilledButton,
} from "../../components";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function SignUp() {
  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "Enter your phone number",
      type: "tel",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      isPassword: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      type: "password",
      isPassword: true,
    },
  ];
  return (
    <AuthLayout>
      <AuthCard
        title="Sign Up"
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

            <FilledButton title="Sign Up" onClick={() => {}} />
          </Stack>
        </Box>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?
          <TextButton title="Sign In" navigateTo="/login" />
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
}
