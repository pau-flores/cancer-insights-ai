"use client";

import { useRef } from "react";
import Chat from "./components/Chat";
import { Button, Container, Grid, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function Home() {
  const chatInputRef = useRef(null);

  const handleAskClick = () => {
    chatInputRef.current?.focus();
  };

  return (
    <main
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: 0,
      }}
    >
      <Container sx={{}}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: { md: "center" },
              textAlign: { xs: "center", lg: "left" },
            }}
          >
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                color: "#1D3557",
                fontSize: "3rem",
                fontWeight: "bold",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Welcome to Cancer Insights
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: "#202C39",
                fontSize: "1.5rem",
                textAlign: { xs: "center", md: "left" },
                mt: 2,
              }}
            >
              Your AI Companion for Understanding Cancer Causes
            </Typography>
            <Button
              variant="contained"
              onClick={handleAskClick}
              sx={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
                mt: 4,
                py: 2,
                backgroundColor: "#1D3557 !important",
                mx: { xs: "auto", md: 0 },
              }}
            >
              Ask our AI <ArrowRightAltIcon sx={{ ml: 1 }} />
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Chat inputRef={chatInputRef} />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
