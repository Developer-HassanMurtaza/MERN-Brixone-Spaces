import { Button } from "@mui/material";
import { Link } from "react-router-dom";

type TextButtonProps = {
  title: string;
  navigateTo: string;
};

export const TextButton = ({ title, navigateTo }: TextButtonProps) => {
  return (
    <Button
      variant="text"
      component={Link}
      to={navigateTo}
      sx={{
        textDecoration: "none",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "transparent",
          textDecoration: "none",
        },
      }}
    >
      {title}
    </Button>
  );
};
