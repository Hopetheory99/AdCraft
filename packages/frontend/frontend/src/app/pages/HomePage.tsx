import { Container, Typography, Box, Button } from '@mui/material';

export function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to AdCraft
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        A modern platform for crafting engaging advertisements.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
