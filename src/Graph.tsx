import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

     const schema = {
      stock: 'string',
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
    elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinctcount',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

    componentDidUpdate() {
    if (this.table) {
      this.table.update(
        DataManipulator.generateRatio(this.props.data, this.props.stock1, this.props.stock2, this.props.upperBound, this.props.lowerBound)
      );
    }
  }
}

export default Graph;
