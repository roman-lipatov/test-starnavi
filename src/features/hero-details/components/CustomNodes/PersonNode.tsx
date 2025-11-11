import { Box, Typography, Paper } from '@mui/material';
import { Handle, Position, type NodeProps } from 'reactflow';

type PersonNodeData = {
  label: string;
  image?: string;
};

export const PersonNode = ({ data }: NodeProps<PersonNodeData>) => {
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
      <Handle type="source" position={Position.Right} id="source" />
      <Handle type="target" position={Position.Left} id="target" />
      {data.image && (
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
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <Typography variant="subtitle2" fontWeight="bold">
        {data.label}
      </Typography>
    </Paper>
  );
};

