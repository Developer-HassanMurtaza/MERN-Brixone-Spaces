import { Box, Button, Stack, Typography } from "@mui/material";
import InputField from "../components/CustomMuiTextField";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <AuthCard title="Forgot Password">
        <Typography variant="body2">
          Please enter your email address to receive a verification code.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <InputField
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            <Button variant="contained" size="large" fullWidth>
              Send
            </Button>
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
