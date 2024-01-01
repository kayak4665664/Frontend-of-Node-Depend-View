import {
  select, forceSimulation, forceLink, forceManyBody, forceCollide,
} from 'd3';
import {
  GraphData, Node, Edge, ColorTheme, WindowSize,
} from './defs';

// Custom force center function for the graph
function customForceCenter(x: number, y: number, strength: number): {
  (alpha: number): void;
  initialize(n: Node[]): void;
} {
  let nodes: Node[];

  // Applies force to nodes towards a center point
  const force: {
    (alpha: number): void;
    initialize(n: Node[]): void;
  } = (alpha: number): void => {
    nodes.forEach((node: Node): void => {
      // Calculate new position for each node
      const newX: number = (node.x ?? 0) + (x - (node.x ?? 0)) * strength * alpha;
      const newY: number = (node.y ?? 0) + (y - (node.y ?? 0)) * strength * alpha;
      node.x = newX;
      node.y = newY;
    });
  };

  // Initialize nodes for the force
  force.initialize = (n: Node[]): void => { nodes = n; };

  return force;
}

// Function to calculate tooltip position based on mouse events
function calculateTooltipPosition(
  event: MouseEvent,
  tooltipElement: Element,
): { x: number, y: number } {
  // Get dimensions of the tooltip
  const tooltipWidth: number = tooltipElement.getBoundingClientRect().width;
  const tooltipHeight: number = tooltipElement.getBoundingClientRect().height;

  // Position tooltip to avoid going off-screen
  let x: number = event.pageX + 10;
  let y: number = event.pageY + 10;

  if (x + tooltipWidth > window.innerWidth) x = event.pageX - tooltipWidth - 10;
  if (y + tooltipHeight > window.innerHeight) y = event.pageY - tooltipHeight - 10;

  return { x, y };
}

// Main function to draw the force-directed graph
function drawForceDirectedGraph(
  data: GraphData,
  windowSize: WindowSize,
  colorTheme: ColorTheme,
): void {
  // Clear existing graph
  select('#graph').selectAll('*').remove();

  // Set dimensions for the SVG container
  const { width } = windowSize;
  const { height } = windowSize;

  // Create SVG container
  const svg = select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const { arrowColors } = colorTheme;
  const defs = svg.append('defs');

  // Define arrow markers for graph edges
  arrowColors.forEach((color: string): void => {
    defs.append('marker')
      .attr('id', `arrowhead-${color.replace('#', '')}`)
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 16)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', color);
  });

  // Create simulation for force-directed graph
  const simulation = forceSimulation(data.nodesList)
    .force('link', forceLink(data.edgesList)
      .id((d) => (d as Node).id)
      .distance(100))
    .force('charge', forceManyBody().strength(-350))
    .force('collide', forceCollide(5))
    .force('center', customForceCenter(width / 2, height / 2, 1.2));

  // Create and style graph links (edges)
  const link = svg.append('g')
    .selectAll('line')
    .data(data.edgesList)
    .enter()
    .append('line')
    .attr('stroke-width', 3)
    .attr('stroke', (e: Edge): string => {
      if (e.isCircular) return colorTheme.circularEdgeColor;
      return colorTheme.edgeColor;
    })
    .attr('marker-end', (e: Edge): string => `url(#arrowhead-${e.isCircular
      ? colorTheme.circularEdgeColor.replace('#', '')
      : colorTheme.edgeColor.replace('#', '')})`)
    .on('mouseover', (event, e: Edge): void => {
      const tooltip = select('#tooltip');
      tooltip.html(`Source: ${e.sourceId}<br>Target: ${e.targetId}`)
        .style('display', 'block');

      const { x, y } = calculateTooltipPosition(event, tooltip.node() as Element);

      tooltip.style('left', `${x}px`).style('top', `${y}px`);
    })
    .on('mouseout', (): void => {
      select('#tooltip').style('display', 'none');
    });

  // Node styling and tooltip event handlers
  const radius: number = 13;
  const maxDepth: number = data.nodesList[0].depth + 1;
  const node = svg.append('g')
    .selectAll('circle')
    .data(data.nodesList)
    .enter()
    .append('circle')
    .attr('r', (d: Node): number => radius - 2.2 * Math.log2(maxDepth - d.depth))
    .attr('fill', (d: Node, i: number): string => {
      if (i === 0) return colorTheme.rootNodeColor;
      if (d.isMultipleVersions) return colorTheme.multipleVersionsNodeColor;
      return colorTheme.nodeColor;
    })
    .on('mouseover', (event, d: Node): void => {
      const tooltip = select('#tooltip');
      tooltip.html(`Name: ${d.name}<br>Version: ${d.version}<br>Depth: ${maxDepth - d.depth}<br>Description: ${d.description}<br>Dir: ${d.dir}`)
        .style('display', 'block');

      const { x, y } = calculateTooltipPosition(event, tooltip.node() as Element);

      tooltip.style('left', `${x}px`)
        .style('top', `${y}px`);
    })
    .on('mouseout', (): void => {
      select('#tooltip').style('display', 'none');
    });

  // Update positions of nodes and links on simulation tick
  simulation.on('tick', (): void => {
    link.attr('x1', (d: Edge) => (d as any).source.x)
      .attr('y1', (d: Edge) => (d as any).source.y)
      .attr('x2', (d: Edge) => (d as any).target.x)
      .attr('y2', (d: Edge) => (d as any).target.y);

    const buffer = 20;
    node.attr('cx', (d: Node): number => {
      d.x = Math.max(buffer, Math.min(width - buffer, d.x ?? width / 2));
      return d.x;
    })
      .attr('cy', (d: Node): number => {
        d.y = Math.max(buffer, Math.min(height - buffer, d.y ?? height / 2));
        return d.y;
      });
  });
}

export default drawForceDirectedGraph;
