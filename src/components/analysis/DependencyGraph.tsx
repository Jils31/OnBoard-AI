import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface DependencyGraphProps {
  data: any;
  codeAnalysis: any;
}

const DependencyGraph = ({ data, codeAnalysis }: DependencyGraphProps) => {
  const fgRef = useRef<any>();

  useEffect(() => {
    if (data && fgRef.current) {
      fgRef.current.zoomToFit(500);
    }
  }, [data]);

  const handleNodeClick = (node: any) => {
    console.log('Clicked node:', node);
    // Implement any specific action you want to take on node click
  };

  const nodeColor = (node: any) => {
    switch (node.type) {
      case 'component': return 'rgba(255, 0, 0, 0.8)';  // Red for components
      case 'service': return 'rgba(0, 255, 0, 0.8)';    // Green for services
      case 'utility': return 'rgba(0, 0, 255, 0.8)';    // Blue for utilities
      default: return 'rgba(128, 128, 128, 0.8)';      // Gray for others
    }
  };

  const edgeColor = (edge: any) => {
    switch (edge.type) {
      case 'imports': return 'rgba(200, 200, 200, 0.5)'; // Light gray for imports
      case 'uses': return 'rgba(150, 150, 150, 0.5)';    // Medium gray for uses
      case 'extends': return 'rgba(100, 100, 100, 0.5)';   // Dark gray for extends
      default: return 'rgba(50, 50, 50, 0.5)';       // Darker gray for others
    }
  };

  const nodeLabel = (node: any) => {
    return `<div style="font-size: 12px; color: black;">${node.label}</div>`;
  };

  const edgeLabel = (edge: any) => {
    return `<div style="font-size: 10px; color: #555;">${edge.description}</div>`;
  };

  const renderCustomNode = (node: any, ctx: any, globalScale: number) => {
    const label = node.label;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const nodeSize = 16;

    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor(node);

    const borderColor = typeof node.color?.border === 'string'
      ? node.color.border
      : 'rgba(75, 192, 192, 0.6)'; // Default color if it's not a string
    const backgroundColor = typeof borderColor === 'string'
      ? borderColor.replace('rgb', 'rgba').replace(')', ', 0.2)')
      : 'rgba(75, 192, 192, 0.2)'; // Default background color

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Draw label
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, node.x || 0, node.y || 0);
  };

  return (
    <div style={{ height: '800px', width: '100%' }}>
      {data ? (
        <ForceGraph2D
          ref={fgRef}
          graphData={data.dependencyGraph}
          nodeLabel={nodeLabel}
          linkLabel={edgeLabel}
          nodeColor={nodeColor}
          edgeColor={edgeColor}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={renderCustomNode}
          nodeCanvasObjectMode={() => 'replace'}
          dagMode="radialout"
          dagLevelDistance={120}
          backgroundColor="#f0f0f0"
        />
      ) : (
        <p>Loading dependency graph...</p>
      )}
    </div>
  );
};

export default DependencyGraph;
