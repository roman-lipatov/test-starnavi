import { Box, Typography } from '@mui/material';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import type { ReactFlowInstance } from '@reactflow/core';
import 'reactflow/dist/style.css';
import { Loader } from '@/shared/components/Loader';
import type { Person, Film } from '@/shared/types/api';
import { useGraphData } from '../hooks/useGraphData';
import { PersonNode } from './CustomNodes/PersonNode';
import { FilmNode } from './CustomNodes/FilmNode';
import { StarshipNode } from './CustomNodes/StarshipNode';
import { useCallback } from 'react';

type HeroGraphProps = {
  heroId: number;
  person: Person;
  films: Film[];
};

const nodeTypes = {
  person: PersonNode,
  film: FilmNode,
  starship: StarshipNode,
};

export const HeroGraph = ({ heroId, person, films }: HeroGraphProps) => {
  const { graphData, isLoading, error } = useGraphData(heroId, person, films);

  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    reactFlowInstance.fitView();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Too many requests. Please wait a moment and try again.
        </Typography>
      </Box>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No graph data available</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: { xs: '400px', sm: '500px', md: '600px' },
        width: '100%', 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'grey.50',
      }}
    >
      <ReactFlow
        nodes={graphData.nodes}
        edges={graphData.edges}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
          }}
          nodeColor={(node) => {
            if (node.type === 'person') return '#1976d2';
            if (node.type === 'film') return '#dc004e';
            return '#2e7d32';
          }}
        />
      </ReactFlow>
    </Box>
  );
};
