import { Signal, ISignal } from '@lumino/signaling';

import { Toolbar, ToolbarButton } from '@jupyterlab/apputils';

interface IOptions {
  onClick: () => void;
}

class RunButton extends ToolbarButton {
  constructor(options: IOptions) {
    super({
      iconClass: 'jp-RunIcon jp-Icon jp-Icon-16',
      onClick: options.onClick
    });
  }
}

class SettingButton extends ToolbarButton {
  constructor(options: IOptions) {
    super({
      iconClass: 'jp-SettingsIcon jp-Icon jp-Icon-16',
      onClick: options.onClick
    });
  }
}

export class TopToolbar extends Toolbar {
  constructor() {
    super();
    this.addClass('pf-sql-toolbar');
    this.addItem('run', new RunButton({ onClick: this._onRunButtonClicked }));
    this.addItem(
      'setting',
      new SettingButton({ onClick: this._onRunButtonClicked })
    );
    this.addItem('spacer', Toolbar.createSpacerItem());
  }

  get backButtonClicked(): ISignal<this, void> {
    return this._runButtonClicked;
  }

  private _onRunButtonClicked(): void {
    // this._backRunClicked.emit(void 0);
  }

  private readonly _runButtonClicked: Signal<this, void> = new Signal(this);
}
