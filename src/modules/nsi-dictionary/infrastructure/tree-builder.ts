import { sortBy, filter } from 'lodash';
export interface Node<Id = string, T = Record<string, unknown>> {
  id: Id;
  name: string;
  payload?: T;
  parentId?: Id;
  children: Node[];
  isEnabled: boolean;
}

export interface GetTreeProps {
  page?: number;
  pageSize?: number;
  search?: string;
}
export type FindNodeCallback<Node> = (node: Node) => boolean;
export class TreeBuilder {
  private nodeMap: Map<Node['id'], Node> = new Map();

  /** nodes with no parentId goes here */
  constructor(rootNodes: Node[] = []) {
    this.deallocateNodes(rootNodes, this.nodeMap);
  }

  get size(): number {
    return this.nodeMap.size;
  }

  public addNode(id: Node['id'], name: Node['name'], parentId?: Node['parentId'], payload?: Node['payload']): void {
    this.nodeMap.set(id, {
      id,
      name,
      isEnabled: true,
      parentId,
      payload,
      children: [],
    });
  }

  public getTree(props: GetTreeProps = {}) {
    for (const node of this.nodeMap.values()) node.children = [];
    console.time('TreeBuilder::tree::allocating-and-filtering');
    const root = this.allocateNodes();
    const filtered = this.filterEnabledNodes(root);
    console.timeEnd('TreeBuilder::tree::allocating-and-filtering');
    const { page, pageSize, search } = props;
    return {
      total: filtered.length,
      data:
        page && pageSize
          ? this.filter(filtered, search).slice((page - 1) * pageSize, page * pageSize)
          : this.filter(filtered, search),
    };
  }

  public getArray(props: GetTreeProps = {}) {
    console.time('TreeBuilder::array::allocating-and-filtering');
    const { page, pageSize, search } = props;
    let formatted = [...this.nodeMap.values()];
    if (search)
      formatted = filter(formatted, (node) => node.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    if (page && pageSize) formatted = formatted.slice((page - 1) * pageSize, page * pageSize);
    console.timeEnd('TreeBuilder::array::allocating-and-filtering');
    return {
      data: formatted,
      total: this.nodeMap.size,
    };
  }

  public enableNodesById(ids: Node['id'][]) {
    for (const [id, node] of this.nodeMap.entries()) {
      node.isEnabled = ids.includes(id);
    }
  }

  private filter(data: Node[], search?: Node['name']) {
    if (search) {
      return data.filter((d) => d.name.toLocaleLowerCase().includes(search));
    }
    return data;
  }

  private allocateNodes(): Node[] {
    const root: Node[] = [];
    for (const node of this.nodeMap.values()) {
      if (!node.parentId) {
        root.push(node);
      } else {
        const parent = this.nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    }
    return root;
  }

  private filterEnabledNodes(nodes: Node[]): Node[] {
    return nodes.flatMap((node) => {
      if (node.isEnabled) {
        if (node.children && node.children.length > 0) {
          node.children = sortBy(this.filterEnabledNodes(node.children), 'name');
        }
        return [node];
      } else {
        return sortBy(this.filterEnabledNodes(node.children), 'name');
      }
    });
  }

  private deallocateNodes(nodes: Node[], nodeMap = new Map<Node['id'], Node>()): Map<Node['id'], Node> {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        this.deallocateNodes(node.children, nodeMap);
      }
      nodeMap.set(node.id, { ...node, children: [] });
    });
    return nodeMap;
  }
}
