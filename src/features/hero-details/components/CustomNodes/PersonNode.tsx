import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Handle, Position, type NodeProps } from 'reactflow';
import { getInitials } from '@/shared/utils/getInitials';
import { useState } from 'react';

type PersonNodeData = {
  label: string;
  image?: string;
};

export const PersonNode = ({ data }: NodeProps<PersonNodeData>) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        minWidth: 150,
        textAlign: 'center',
        backgroundColor: '#1976d2',
        color: 'white',
        position: 'relative',
      }}
    >
      <Handle type="source" position={Position.Bottom} id="source" />
      <Handle type="target" position={Position.Top} id="target" />
      {imageError || !data.image ? (
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            mb: 1,
            border: '2px solid white',
            mx: 'auto',
          }}
        >
          {getInitials(data.label)}
        </Avatar>
      ) : (
        <Box
          component="img"
          src={data.image}
          alt={data.label}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            mb: 1,
            border: '2px solid white',
            mx: 'auto',
            display: 'block',
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      )}
      <Typography variant="subtitle2" fontWeight="bold">
        {data.label}
      </Typography>
    </Paper>
  );
};

