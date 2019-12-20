namespace graphStructure {
  export interface Element {
    id: number | string;
    label: string;
  }

  export interface Property {
    key: string;
    value: string;
  }

  export interface Vertex extends Element {
    properties?: VertexProperty[];
  }

  export interface VertexProperty extends Element {
    value: any;
    properties?: Property[];
  }
}

export { graphStructure };
