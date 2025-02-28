
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Blog, GraphData, processGraphData } from "@/utils/sample-data";

const KnowledgeGraph = dynamic(() => import("@/components/knowledge-graph"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center">
      Loading graph...
    </div>
  ),
});

interface KnowledgeGraphWrapperProps {
  blogs: Blog[];
}

export default function KnowledgeGraphWrapper({ blogs }: KnowledgeGraphWrapperProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    if (blogs.length > 0) {
      const processedData = processGraphData(blogs);
      setGraphData(processedData);
    } else {
      setGraphData(null);
    }
  }, [blogs]);

  if (!graphData) return null;

  return <KnowledgeGraph data={graphData} />;
}