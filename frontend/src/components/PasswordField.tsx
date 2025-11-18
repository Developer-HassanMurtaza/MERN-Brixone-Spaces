import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

interface PasswordFieldProps {
  placeholder: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  placeholder,
  icon,
  value,
  onChange,
}: PasswordFieldProps) {
  return (
    <Input.Password
      size="large"
      placeholder={placeholder}
      prefix={icon}
      value={value}
      onChange={onChange}
      iconRender={(visible) =>
        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      }
    />
  );
}
