import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import {
  BrixoneBlueLogo,
  MailIcon,
  MapIcon,
  PhoneIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedIn,
  SendIcon,
} from "../assets";
import { MuiContactCard } from "./MuiContactCard";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

// ╔═════════════════════╗
// ║     Props Types     ║
// ╚═════════════════════╝
type MuiDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type ContactCardDataProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type SocialMediaListProps = {
  icon: string;
  alt: string;
  isPrimary?: boolean;
};

// ╔═══════════════════════════╗
// ║     Contact Card Data     ║
// ╚═══════════════════════════╝
const contactCardData: ContactCardDataProps[] = [
  {
    icon: <Box component="img" src={MapIcon} alt="Map Icon" />,
    label: "Address",
    value: "lorem Ipsum Ahmadabad, India",
  },
  {
    icon: <Box component="img" src={PhoneIcon} alt="Phone Icon" />,
    label: "Phone",
    value: "+91 (309) 2087119",
  },
  {
    icon: <Box component="img" src={MailIcon} alt="Mail Icon" />,
    label: "Mail",
    value: "info@brixonespaces.com",
  },
];

// ╔═══════════════════════════╗
// ║    Social Media List      ║
// ╚═══════════════════════════╝
const socialMediaList: SocialMediaListProps[] = [
  {
    icon: FacebookIcon,
    alt: "Facebook Icon",
    isPrimary: true,
  },
  {
    icon: InstagramIcon,
    alt: "Instagram Icon",
    isPrimary: false,
  },
  {
    icon: XIcon,
    alt: "X (Twitter) Icon",
    isPrimary: false,
  },
  {
    icon: LinkedIn,
    alt: "LinkedIn Icon",
    isPrimary: false,
  },
];

// ╔═══════════════════╗
// ║     MuiDrawer     ║
// ╚═══════════════════╝
export const MuiDrawer = ({ open, onClose }: MuiDrawerProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = () => {
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: "25rem" },
          height: "100vh",
          backgroundColor: "white",
          p: 3,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        role="presentation"
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 1 }}>
          <Box
            component="img"
            src={BrixoneBlueLogo}
            sx={{ width: "10rem", mr: 1.5 }}
          />
        </Box>

        {/* Introductory Text */}
        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
          facilisis libero, in cursus magna. Vestibulum eleifend felis ac
          ultricies facilisis. Vivamus augue risus, elementum vel laoreet a,
          molestie congue sem.
        </Typography>

        {/* Get in Touch Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            mb: 1,
          }}
        >
          Get in Touch
        </Typography>

        {/* Contacts */}
        {contactCardData.map((item, index) => (
          <MuiContactCard
            key={item.label}
            {...item}
            mb={index === contactCardData.length - 1 ? 2 : 1.5}
          />
        ))}

        {/* Newsletter Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            mb: 1,
          }}
        >
          Our Newsletter
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 1,
            p: 0.3,
            border: "1px solid lightgray",
            borderRadius: "8px",
          }}
        >
          <TextField
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                color: "#999",
                fontSize: "0.875rem",
              },
            }}
          />
          <IconButton
            onClick={handleEmailSubmit}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              borderRadius: "8px",
              width: 40,
              height: 40,
              minWidth: 40,
              alignSelf: "center",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <Box component="img" src={SendIcon} alt="Send Icon" />
          </IconButton>
        </Box>

        {/* Social Media Icons */}
        <Stack direction="row" sx={{ mt: 1, justifyContent: "flex-start" }}>
          {socialMediaList.map((item, index) => (
            <Avatar
              key={index}
              sx={{
                bgcolor: "white",
                cursor: "pointer",
              }}
            >
              <Box component="img" src={item.icon} alt={item.alt} sx={{}} />
            </Avatar>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
};
