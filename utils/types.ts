export interface GraphNode {
    id: string
    name: string
    val: number
    color?: string
  }
  
  export interface GraphLink {
    source: string
    target: string
  }
  
  export interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
  }
  
  