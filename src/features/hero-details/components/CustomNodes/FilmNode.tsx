import { Typography, Paper } from '@mui/material';
import { Handle, Position, type NodeProps } from 'reactflow';

type FilmNodeData = {
  label: string;
  episode?: number;
};

export const FilmNode = ({ data }: NodeProps<FilmNodeData>) => {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 1.5,
        minWidth: 120,
        textAlign: 'center',
        backgroundColor: '#dc004e',
        color: 'white',
        position: 'relative',
      }}
    >
      <Handle type="source" position={Position.Bottom} id="source" />
      <Handle type="target" position={Position.Top} id="target" />
      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
        Episode {data.episode}
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
        {data.label}
      </Typography>
    </Paper>
  );
};

