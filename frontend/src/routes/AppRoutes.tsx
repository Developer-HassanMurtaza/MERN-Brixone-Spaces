import { Routes, Route } from "react-router-dom";
import {
  Login,
  SignUp,
  ForgotPassword,
  ResetPassword,
  VerifyCode,
} from "../pages";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
    </Routes>
  );
}
