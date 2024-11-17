import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';

interface AuthPageProps {
  children: React.ReactNode;
  title: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ children, title }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <FlightTakeoff
              sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}
            />
            <Typography component="h1" variant="h4" gutterBottom>
              Smart Travel Planner
            </Typography>
            <Typography component="h2" variant="h6" color="textSecondary">
              {title}
            </Typography>
          </Box>

          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;
