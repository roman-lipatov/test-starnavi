import { Typography, Paper } from '@mui/material';
import { Handle, Position, type NodeProps } from 'reactflow';

type StarshipNodeData = {
  label: string;
  model?: string;
};

export const StarshipNode = ({ data }: NodeProps<StarshipNodeData>) => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: 1,
        minWidth: 100,
        textAlign: 'center',
        backgroundColor: '#2e7d32',
        color: 'white',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Left} id="target" />
      <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
        {data.label}
      </Typography>
      {data.model && (
        <Typography variant="caption" display="block" sx={{ fontSize: '0.65rem', mt: 0.5, opacity: 0.9 }}>
          {data.model}
        </Typography>
      )}
    </Paper>
  );
};

