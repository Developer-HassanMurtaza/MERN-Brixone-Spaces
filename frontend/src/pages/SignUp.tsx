import { Box, Button, Stack, Typography } from "@mui/material";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

export default function SignUp() {
  return (
    <AuthLayout>
      <AuthCard title="Sign Up">
        <Typography variant="body2">Welcome! Please enter your details</Typography>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {[
              { name: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
              { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
              { name: "phoneNumber", label: "Phone Number", placeholder: "Enter your phone number", type: "tel" },
              { name: "password", label: "Password", placeholder: "Enter your password", type: "password" },
              { name: "confirmPassword", label: "Confirm Password", placeholder: "Confirm your password", type: "password" },
            ].map((f) => (
              <InputField
                key={f.name}
                label={f.label}
                placeholder={f.placeholder}
                type={f.type}
              />
            ))}
            <Button variant="contained" size="large" fullWidth>
              Sign Up
            </Button>
          </Stack>
        </Box>
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </AuthCard>
    </AuthLayout>
  );
}
