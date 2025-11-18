import { Button, Form, Typography, Checkbox } from "antd";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/PasswordField";

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard title="Sign In">
        <Typography.Text>Welcome! Please enter your details</Typography.Text>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="email">
            <InputField placeholder="Enter your email" type="email" />
          </Form.Item>
          <Form.Item name="password">
            <PasswordField placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Checkbox>Remember me</Checkbox>
            <Link style={{ float: "right" }} to="/forgot-password">
              Forgot Password?
            </Link>
          </Form.Item>
          <Form.Item>
            <Button type="primary" block size="large">
              Log In
            </Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </Typography.Paragraph>
      </AuthCard>
    </AuthLayout>
  );
}
