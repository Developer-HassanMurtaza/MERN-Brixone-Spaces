import { Input } from "antd";

interface InputFieldProps {
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  placeholder,
  icon,
  type,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <Input
      size="large"
      placeholder={placeholder}
      prefix={icon}
      type={type || ""}
      value={value}
      onChange={onChange}
    />
  );
}
