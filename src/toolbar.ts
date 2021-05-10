import { Signal, ISignal } from '@lumino/signaling';

import { Toolbar, ToolbarButton } from '@jupyterlab/apputils';

interface IOptions {
  onClick: () => void;
}

class RunButton extends ToolbarButton {
  constructor(options: IOptions) {
    super({
      tooltip: 'Run',
      iconClass: 'jp-RunIcon jp-Icon jp-Icon-16',
      onClick: options.onClick
    });
  }
}

class SettingButton extends ToolbarButton {
  constructor(options: IOptions) {
    super({
      tooltip: 'Setting',
      iconClass: 'jp-SettingsIcon jp-Icon jp-Icon-16',
      onClick: options.onClick
    });
  }
}

export class TopToolbar extends Toolbar {
  constructor() {
    super();
    this._onRunButtonClicked = this._onRunButtonClicked.bind(this);
    this._onSettingButtonClicked = this._onSettingButtonClicked.bind(this);

    this.addClass('pf-sql-toolbar');

    this.addItem('run', new RunButton({ onClick: this._onRunButtonClicked }));
    this.addItem(
      'setting',
      new SettingButton({ onClick: this._onSettingButtonClicked })
    );
    this.addItem('spacer', Toolbar.createSpacerItem());
  }

  public get runButtonClicked(): ISignal<this, void> {
    return this._runButtonClicked;
  }

  get settingButtonClicked(): ISignal<this, void> {
    return this._settingButtonClicked;
  }

  private _onRunButtonClicked(): void {
    this._runButtonClicked.emit(void 0);
  }

  private _onSettingButtonClicked(): void {
    this._settingButtonClicked.emit(void 0);
  }

  private readonly _runButtonClicked = new Signal<this, void>(this);
  private readonly _settingButtonClicked = new Signal<this, void>(this);
}
