import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemMapProps {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  connections: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
}

const SystemMap: React.FC<SystemMapProps> = ({ nodes, connections }) => {
  return (
    <Card className="border-blue-100 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="text-2xl">System Components Map</CardTitle>
        <CardDescription>
          Visual representation of system components and their relationships
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 rounded-md bg-white dark:bg-gray-700 border relative">
          {nodes && nodes.length > 0 ? (
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {/* Render nodes */}
              {nodes.slice(0, 12).map((node, index) => {
                const x = 80 + (index % 4) * 180;
                const y = 40 + Math.floor(index / 4) * 120;
                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                const color = colors[index % colors.length];
                
                return (
                  <g key={node.id}>
                    <rect 
                      x={x} 
                      y={y} 
                      width={160} 
                      height={80} 
                      rx={5} 
                      fill={color} 
                      fillOpacity={0.2} 
                      stroke={color} 
                    />
                    <text 
                      x={x + 80} 
                      y={y + 35} 
                      textAnchor="middle" 
                      fill="currentColor"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                    <text 
                      x={x + 80} 
                      y={y + 55} 
                      textAnchor="middle" 
                      fill="currentColor" 
                      fontSize="10"
                    >
                      {node.type}
                    </text>
                  </g>
                );
              })}
              
              {/* Render connections */}
              {connections && connections.slice(0, 20).map((connection, index) => {
                const sourceIndex = nodes.findIndex(n => n.id === connection.from);
                const targetIndex = nodes.findIndex(n => n.id === connection.to);
                
                if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex < 12 && targetIndex < 12) {
                  const sourceX = 80 + (sourceIndex % 4) * 180 + 80;
                  const sourceY = 40 + Math.floor(sourceIndex / 4) * 120 + 40;
                  const targetX = 80 + (targetIndex % 4) * 180 + 80;
                  const targetY = 40 + Math.floor(targetIndex / 4) * 120 + 40;
                  
                  const midX = (sourceX + targetX) / 2;
                  const midY = (sourceY + targetY) / 2;
                  const offset = 40;
                  
                  const path = `M ${sourceX} ${sourceY} Q ${midX + offset} ${midY} ${targetX} ${targetY}`;
                  const labelX = midX + offset / 2;
                  const labelY = midY - 10;
                  
                  return (
                    <g key={`${connection.from}-${connection.to}-${index}`}>
                      <path 
                        d={path} 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <text 
                        x={labelX} 
                        y={labelY} 
                        textAnchor="middle" 
                        fill="currentColor" 
                        fontSize="10"
                        className="select-none"
                      >
                        {connection.label?.substring(0, 20)}
                      </text>
                    </g>
                  );
                }
                return null;
              })}
              
              {/* Arrow definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No system map data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMap;