import { Button } from "@mui/material";
import { Link } from "react-router-dom";

type CustomTextButtonProps = {
  title: string;
  navigateTo: string;
};

export const CustomTextButton = ({
  title,
  navigateTo,
}: CustomTextButtonProps) => {
  return (
    <Button
      variant="text"
      component={Link}
      to={navigateTo}
      sx={{ textDecoration: "none", textTransform: "capitalize" }}
    >
      {title}
    </Button>
  );
};
