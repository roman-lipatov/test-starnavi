import { Alert, AlertTitle } from '@mui/material';

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};