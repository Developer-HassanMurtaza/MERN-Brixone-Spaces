import { Button, Form, Typography } from "antd";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <AuthCard title="Forgot Password">
        <Typography.Text>
          Please enter your email address to receive a verification code.{" "}
        </Typography.Text>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="email">
            <InputField placeholder="Enter your email" type="email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block size="large">
              Send
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
}
