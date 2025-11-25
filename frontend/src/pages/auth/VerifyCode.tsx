import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { AuthCard, FilledButton, OTPInputFields } from "../../components";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function VerifyCode() {
  const [code, setCode] = useState("");

  return (
    <AuthLayout>
      <AuthCard
        title="OTP Verification"
        description="Please enter the 6 digit code sent to abc@gmail.com"
      >
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: 14 }}>
                OTP Code
              </Typography>
              <OTPInputFields value={code} onChange={setCode} />
            </Box>
            <FilledButton title="Verify Code" onClick={() => {}} />
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
