"use client";

import type { GraphData, GraphNode } from "@/utils/types";
import { useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

interface KnowledgeGraphProps {
  data: GraphData;
}

export default function KnowledgeGraph({ data }: KnowledgeGraphProps) {
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-1000);
      graphRef.current.d3Force("link").distance(100);
      graphRef.current.d3Force("center").strength(0.5);

      const centerGraph = () => {
        graphRef.current.centerAt(0, 0, 1100);
        graphRef.current.zoom(1.5, 1000);
      };

      centerGraph();
      window.addEventListener("resize", centerGraph);
      return () => window.removeEventListener("resize", centerGraph);
    }
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div className="relative w-full h-[450px] rounded-lg overflow-hidden bg-white justify-center flex items-center">
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeLabel={""}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          ctx.fillText(node.name, node.x!, node.y! + 8);
        }}
        nodeColor={(node: GraphNode) => node.color || "#000000"}
        nodeVal={(node) => node.val}
        linkColor={() => "#94A3B8"}
        backgroundColor="#ffffff"
        linkCurvature={0}
        linkDirectionalArrowLength={0}
        nodeRelSize={3}
        linkWidth={1}
        width={window.innerWidth * 0.95}
        height={600}
        cooldownTicks={100}
        nodeCanvasObjectMode={() => "after"}
      />
    </div>
  );
}
