import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import OtpInput from "../components/OtpInput";

export default function VerifyCode() {
  const [code, setCode] = useState("");

  return (
    <AuthLayout>
      <AuthCard title="OTP Verification">
        <Typography variant="body2">
          Please enter the 6 digit code sent to abc@gmail.com
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600, fontSize: 14 }}>
                OTP Code
              </Typography>
              <OtpInput value={code} onChange={setCode} />
            </Box>
            <Button variant="contained" size="large" fullWidth>
              Verify Code
            </Button>
          </Stack>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
