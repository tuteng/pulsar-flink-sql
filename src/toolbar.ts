import { Signal, ISignal } from '@lumino/signaling';

import { Toolbar, ToolbarButton } from '@jupyterlab/apputils';

// import { ToolbarItems } from '../components';

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
    this.addItem('run', new RunButton({ onClick: this._onBackButtonClicked }));
    this.addItem(
      'setting',
      new SettingButton({ onClick: this._onBackButtonClicked })
    );
    this.addItem('spacer', Toolbar.createSpacerItem());
    // console.log(this.node);
    // this.addItem('url', new ToolbarItems.ConnectionUrlItem('connectionUrl'));
    // this.addItem('loading', this._loadingIcon);
  }

  get backButtonClicked(): ISignal<this, void> {
    return this._backButtonClicked;
  }

  private _onBackButtonClicked(): void {
    console.log('run');
    // this._backButtonClicked.emit(void 0);
  }

  // setLoading(isLoading: boolean) {
  //   this._loadingIcon.setLoading(isLoading);
  // }

  // private readonly _loadingIcon: ToolbarItems.LoadingIcon = new ToolbarItems.LoadingIcon();
  private readonly _backButtonClicked: Signal<this, void> = new Signal(this);
}
