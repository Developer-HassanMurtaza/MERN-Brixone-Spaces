import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

export default function Login() {
  const fields = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  ];

  return (
    <AuthLayout>
      <AuthCard
        title="Sign In"
        description="Welcome! Please enter your details"
      >
        <Box sx={{ mt: 2 }}>
          <Stack>
            {fields.map((field) => (
              <InputField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
              />
            ))}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Link to="/forgot-password">Forgot Password?</Link>
            </Box>
            <Button variant="contained" size="large" fullWidth>
              Log In
            </Button>
          </Stack>
        </Box>
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
}
