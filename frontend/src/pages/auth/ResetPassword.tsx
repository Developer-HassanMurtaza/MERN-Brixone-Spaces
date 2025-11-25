import { Box, Stack } from "@mui/material";
import { AuthCard, FilledButton, InputField } from "../../components";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function ResetPassword() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create New Password"
        description="Your new password must be different from previously used password."
      >
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {[
              {
                name: "newPassword",
                label: "New Password",
                placeholder: "Enter your new password",
                type: "password",
                isPassword: true,
              },
              {
                name: "confirmNewPassword",
                label: "Confirm New Password",
                placeholder: "Confirm your new password",
                type: "password",
                isPassword: true,
              },
            ].map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder}
                type={f.type}
              />
            ))}
            <FilledButton title="Save New Password" onClick={() => {}} />
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
