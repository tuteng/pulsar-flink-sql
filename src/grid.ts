import {
  ITranslator,
  nullTranslator,
  TranslationBundle
} from '@jupyterlab/translation';

import { DataGrid, DataModel } from '@lumino/datagrid';

import { StackedPanel } from '@lumino/widgets';

interface ISQLResult {
  columns: Array<any>;
  data: Array<any>;
}
export class DataGridPanel extends StackedPanel {
  constructor(translator?: ITranslator) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');

    this.addClass('jp-pf-sql-view');
    this.id = 'pf-sql-view';
    this.title.label = this._trans.__('Pulsar Flink Data View');
    this.title.closable = true;

    this._model = new SQLDataModel([], []);
    this._grid = new DataGrid();
    this._grid.dataModel = this._model;
    this._grid.hide();
    this.addWidget(this._grid);
  }

  set data(sqlData: ISQLResult) {
    this._model = new SQLDataModel(sqlData.columns, sqlData.data);
    this._grid.dataModel = this._model;
    sqlData.data.forEach((_, index) => {
      const size = 120;
      this._grid.resizeColumn('row-header', index, size);
      this._grid.resizeColumn('body', index, size);
    });

    this._grid.show();
  }

  private _translator: ITranslator;
  private _trans: TranslationBundle;
  private _model: DataModel;
  private _grid: DataGrid;
}

class SQLDataModel extends DataModel {
  constructor(columns: Array<any>, data: Array<any>) {
    super();
    this._data = data;
    this._columns = columns;
  }

  rowCount(region: DataModel.RowRegion): number {
    return region === 'body' ? this._data.length : 1;
  }

  columnCount(region: DataModel.ColumnRegion): number {
    return region === 'body' ? this._columns.length : 1;
  }

  data(region: DataModel.CellRegion, row: number, column: number): any {
    if (region === 'row-header') {
      return row;
    }
    if (region === 'column-header') {
      return this._columns[column].name;
    }
    if (region === 'corner-header') {
      return 'index';
    }
    return this._data[row][column];
  }

  private _data: Array<any>;
  private _columns: Array<any>;
}
