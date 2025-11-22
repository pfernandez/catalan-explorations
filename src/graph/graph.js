import { createIdGenerator, invariant, buildParentIndex, replaceNode } from '../utils.js';

/**
 * @typedef {Object} GraphNode
 * @property {string} id
 * @property {string} kind
 * @property {string} label
 * @property {string[]} [children]
 * @property {string} [anchorKey]
 * @property {string} [aliasKey]
 */

/**
 * @typedef {Object} GraphLink
 * @property {string} id
 * @property {string} from
 * @property {string} to
 * @property {string} kind
 */

/**
 * @typedef {Object} Graph
 * @property {GraphNode[]} nodes
 * @property {GraphLink[]} links
 */

const nextNodeId = createIdGenerator('n');
const nextLinkId = createIdGenerator('l');

export function createGraph() {
  return { nodes: [], links: [] };
}

export function addNode(graph, node) {
  const id = node.id ?? nextNodeId();
  const record = { ...node, id };
  return {
    graph: { ...graph, nodes: [...graph.nodes, record] },
    id,
  };
}

export function addLink(graph, link) {
  const id = link.id ?? nextLinkId();
  const record = { ...link, id };
  return {
    graph: { ...graph, links: [...graph.links, record] },
    id,
  };
}

export function getNode(graph, id) {
  const node = graph.nodes.find(node => node.id === id);
  invariant(Boolean(node), `Unknown node ${id}`);
  return node;
}

export function updateNode(graph, id, updater) {
  return {
    ...graph,
    nodes: replaceNode(graph.nodes, id, updater),
  };
}

export function replaceChild(graph, parentId, oldChildId, newChildId) {
  return updateNode(graph, parentId, node => {
    if (!node.children) return node;
    return {
      ...node,
      children: node.children.map(child => (child === oldChildId ? newChildId : child)),
    };
  });
}

export function removeNode(graph, nodeId) {
  return {
    nodes: graph.nodes.filter(node => node.id !== nodeId),
    links: graph.links.filter(link => link.from !== nodeId && link.to !== nodeId),
  };
}

export function cloneSubgraph(graph, rootId) {
  const nodeMap = new Map();
  const sourceGraph = graph;
  let workingGraph = graph;

  function cloneNode(id) {
    if (nodeMap.has(id)) return nodeMap.get(id);
    const source = getNode(sourceGraph, id);
    const children = source.children?.map(childId => cloneNode(childId));
    const clone = addNode(workingGraph, { ...source, id: undefined, children });
    workingGraph = clone.graph;
    nodeMap.set(id, clone.id);
    return clone.id;
  }

  const newRootId = cloneNode(rootId);
  let finalGraph = workingGraph;
  sourceGraph.links
    .filter(link => nodeMap.has(link.from) && nodeMap.has(link.to))
    .forEach(link => {
      finalGraph = addLink(finalGraph, {
        kind: link.kind,
        from: nodeMap.get(link.from),
        to: nodeMap.get(link.to),
      }).graph;
    });

  return { graph: finalGraph, rootId: newRootId };
}

export function replaceSlotsWith(graph, binderKey, replacementRootId) {
  const parentIndex = buildParentIndex(graph.nodes);
  const slotIds = graph.nodes
    .filter(node => node.kind === 'slot' && node.aliasKey === binderKey)
    .map(node => node.id);

  let nextGraph = graph;
  slotIds.forEach(slotId => {
    const parents = parentIndex.get(slotId) ?? [];
    parents.forEach(parentId => {
      nextGraph = replaceChild(nextGraph, parentId, slotId, replacementRootId);
    });
    nextGraph = removeNode(nextGraph, slotId);
  });
  return nextGraph;
}
