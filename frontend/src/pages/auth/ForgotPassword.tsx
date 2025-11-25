import { Box, Stack } from "@mui/material";
import { InputField, AuthCard, FilledButton } from "../../components";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        description="Please enter your email address to receive a verification code."
      >
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            <FilledButton title="Send" onClick={() => {}} />
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
