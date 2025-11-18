import { useState } from "react";
import { Button, Form, Typography } from "antd";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout";
import OtpInput from "../components/OtpInput";

export default function VerifyCode() {
  const [code, setCode] = useState("");

  return (
    <AuthLayout>
      <AuthCard title="OTP Verification">
        <Typography.Text>
          Please enter the 6 digit code sent to abc@gmail.com
        </Typography.Text>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="OTP Code">
            <OtpInput value={code} onChange={setCode} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block size="large">
              Verify Code
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
}
