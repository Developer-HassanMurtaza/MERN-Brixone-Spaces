import { Button, Form, Typography } from "antd";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/PasswordField";

export default function SignUp() {
  return (
    <AuthLayout>
      <AuthCard title="Sign Up">
        <Typography.Text>Welcome! Please enter your details</Typography.Text>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="fullName">
            <InputField placeholder="Enter your full name" type="text" />
          </Form.Item>
          <Form.Item name="email">
            <InputField placeholder="Enter your email" type="email" />
          </Form.Item>
          <Form.Item name="phoneNumber">
            <InputField placeholder="Enter your phone number" type="tel" />
          </Form.Item>
          <Form.Item name="password">
            <PasswordField placeholder="Enter your password" />
          </Form.Item>
          <Form.Item name="confirmPassword">
            <PasswordField placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block size="large">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          Already have an account? <Link to="/">Login</Link>
        </Typography.Paragraph>
      </AuthCard>
    </AuthLayout>
  );
}
