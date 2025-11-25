import { Typography } from "@mui/material";
import { TextButton } from "./TextButton";

type AuthLinkPromptProps = {
  message: string;
  title: string;
  navigateTo: string;
};

export const AuthLinkPrompt = ({
  message,
  title,
  navigateTo,
}: AuthLinkPromptProps) => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      {message}
      <TextButton title={title} navigateTo={navigateTo} />
    </Typography>
  );
};
