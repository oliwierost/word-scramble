import React from "react";

import { Container, Stack } from "@mui/material";
import { WordScramble } from "components/WordScramble";

export default function Home() {
  return (
    <Container
      maxWidth="md"
      sx={{ bgcolor: (theme) => theme.palette.grey[200] }}
    >
      <Stack height="100vh" alignItems="center" justifyContent="center">
        <WordScramble />
      </Stack>
    </Container>
  );
}
