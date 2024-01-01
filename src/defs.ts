interface Node {
  x: number | undefined;
  y: number | undefined;
  id: string;
  name: string;
  version: string;
  description: string;
  dir: string;
  depth: number;
  isMultipleVersions: boolean;
}

interface Edge {
  source: string;
  sourceId: string;
  target: string;
  targetId: string;
  isCircular: boolean;
}

interface GraphData {
  nodesList: Node[];
  edgesList: Edge[];
}

interface ColorTheme {
  arrowColors: string[];
  circularEdgeColor: string;
  edgeColor: string;
  rootNodeColor: string;
  multipleVersionsNodeColor: string;
  nodeColor: string;
  tooltipBorderColor: string;
  tooltipBackgroundColor: string;
  tooltipTextColor: string;
}

const darkTheme: ColorTheme = {
  arrowColors: ['#0f0', '#f00'],
  circularEdgeColor: '#f00',
  edgeColor: '#0f0',
  rootNodeColor: '#ffa500',
  multipleVersionsNodeColor: '#f00',
  nodeColor: '#fff',
  tooltipBorderColor: '#ddd',
  tooltipBackgroundColor: '#000',
  tooltipTextColor: '#fff',
};

const lightTheme: ColorTheme = {
  arrowColors: ['#0f0', '#f00'],
  circularEdgeColor: '#f00',
  edgeColor: '#0f0',
  rootNodeColor: '#ffa500',
  multipleVersionsNodeColor: '#f00',
  nodeColor: '#000',
  tooltipBorderColor: '#222',
  tooltipBackgroundColor: '#fff',
  tooltipTextColor: '#000',
};

interface WindowSize {
  width: number;
  height: number;
}

export { darkTheme, lightTheme };
export type {
  Node, Edge, GraphData, ColorTheme, WindowSize,
};
