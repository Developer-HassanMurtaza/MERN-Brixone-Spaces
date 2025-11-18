import { Card } from "antd";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
}

export default function AuthCard({ children, title }: AuthCardProps) {
  return (
    <Card
      title={
        title ? (
          <span style={{ fontSize: 22, fontWeight: 600 }}>{title}</span>
        ) : undefined
      }
      style={{ width: "100%", maxWidth: 549, borderRadius: 15 }}
      styles={{
        body: { padding: "0px 24px 24px 24px" },
        header: {
          borderBottom: "none",
        },
      }}
    >
      {children}
    </Card>
  );
}
