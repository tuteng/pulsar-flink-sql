import {
  ITranslator,
  nullTranslator,
  TranslationBundle
} from '@jupyterlab/translation';

import { DataGrid, DataModel } from '@lumino/datagrid';

import { StackedPanel } from '@lumino/widgets';

export class DataGridPanel extends StackedPanel {
  constructor(translator?: ITranslator) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');

    this.addClass('jp-example-view');
    this.id = 'datagrid-example';
    this.title.label = this._trans.__('Datagrid Example View');
    this.title.closable = true;

    const model = new SQLDataModel([]);
    const grid = new DataGrid();
    grid.dataModel = model;

    this.addWidget(grid);
  }

  private _translator: ITranslator;
  private _trans: TranslationBundle;
}

class SQLDataModel extends DataModel {
  constructor(data: Array<any>) {
    super();
    this._data = data;
  }

  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? this._data.length : 1;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? 5 : 1;
  }

  data(region: DataModel.CellRegion, row: number, column: number): any {
    if (region === 'row-header') {
      return `R: ${row}, ${column}`;
    }
    if (region === 'column-header') {
      return `C: ${row}, ${column}`;
    }
    if (region === 'corner-header') {
      return `N: ${row}, ${column}`;
    }
    return `(${row}, ${column})`;
  }

  private _data: Array<any>;
}
