export interface Blog {
  id: string;
  title: string;
  keywords?: string;
  author?:string
}

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  name: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

function parseKeywords(keywords?: string): string[] {
  if (!keywords) return []
  try {
    // Remove the markdown code block markers and parse the JSON
    const cleanKeywords = keywords.replace(/```\n|\n```/g, "")
    const parsed = JSON.parse(cleanKeywords)
    // Flatten all values from all categories into a single array
    return Object.values(parsed).flat() as string[]
  } catch (e) {
    console.error("Error parsing keywords:", e)
    return []
  }
}

export function processGraphData(blogs: Blog[]): GraphData {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const nodeIds = new Set<string>()

  // Create nodes
  blogs.forEach((blog, index) => {
    if (!nodeIds.has(blog.id)) {
      nodeIds.add(blog.id)
      nodes.push({
        id: blog.id,
        name: blog.title,
        val: 5,
        color: index % 2 === 0 ? "#4299E1" : "#F56565", // Alternating blue and red
      })
    }
  })

  // Create links
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]
    const blogKeywords = parseKeywords(blog.keywords)

    for (let j = i + 1; j < blogs.length; j++) {
      const otherBlog = blogs[j]
      const otherKeywords = parseKeywords(otherBlog.keywords)

      const commonKeywords = blogKeywords.filter((keyword) => otherKeywords.includes(keyword))

      if (commonKeywords.length > 0) {
        links.push({
          source: blog.id,
          target: otherBlog.id,
          name: commonKeywords.join(", "),
        })
      }
    }
  }

  return { nodes, links }
}

