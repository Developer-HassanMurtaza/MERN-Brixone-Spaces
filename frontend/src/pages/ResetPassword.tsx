import { Box, Button, Stack, Typography } from "@mui/material";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import InputField from "../components/CustomMuiTextField";

export default function ResetPassword() {
  return (
    <AuthLayout>
      <AuthCard title="Create New Password">
        <Typography variant="body2">
          Your new password must be different from previously used password.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {[
              {
                name: "newPassword",
                label: "New Password",
                placeholder: "Enter your new password",
                type: "password",
              },
              {
                name: "confirmNewPassword",
                label: "Confirm New Password",
                placeholder: "Confirm your new password",
                type: "password",
              },
            ].map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder}
                type={f.type}
              />
            ))}
            <Button variant="contained" size="large" fullWidth>
              Save New Password
            </Button>
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
