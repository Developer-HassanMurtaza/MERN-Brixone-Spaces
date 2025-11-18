import { Button, Form, Typography } from "antd";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/PasswordField";

export default function ResetPassword() {
  return (
    <AuthLayout>
      <AuthCard title="Create New Password">
        <Typography.Text>
          Your new password must be different from previously used password.
        </Typography.Text>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="newPassword">
            <PasswordField placeholder="Enter your new password" />
          </Form.Item>
          <Form.Item name="confirmNewPassword">
            <PasswordField placeholder="Confirm your new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block size="large">
              Save New Password
            </Button>
          </Form.Item>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
}
