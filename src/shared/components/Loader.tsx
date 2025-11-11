import { CircularProgress, Box, Typography } from '@mui/material';

type LoaderProps = {
  message?: string;
  size?: number;
};

export const Loader = ({ message = 'Loading...', size = 50 }: LoaderProps) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="200px"
      gap={2}
    >
      <CircularProgress 
        size={size}
        thickness={4}
        sx={{
          color: 'primary.main',
          animationDuration: '1.5s',
        }}
      />
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};