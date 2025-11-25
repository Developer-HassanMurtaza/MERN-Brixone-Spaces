import { Button, type Theme, type SxProps } from "@mui/material";

type CustomMuiFilledButtonProps = {
  title: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
};

export const FilledButton = ({
  title,
  onClick,
  sx,
}: CustomMuiFilledButtonProps) => {
  return (
    <Button
      sx={{ mt: "40px", mb: "30px", textTransform: "capitalize", ...sx }}
      variant="contained"
      size="large"
      fullWidth
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
