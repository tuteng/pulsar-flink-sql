import { Message } from '@lumino/messaging';

import { BoxPanel, Widget } from '@lumino/widgets';
import { Toolbar } from '@jupyterlab/apputils';
import { editorServices } from '@jupyterlab/codemirror';

import { Editor, IEditor } from './editor';
import { TopToolbar } from './toolbar';
import { Api } from './services';

export class PulsarFinkSQLWidget extends BoxPanel {
  /**
   * Construct a new SQL widget.
   */
  constructor() {
    super();

    this.addClass('pf-sql-widget');

    this.editor = new Editor('', editorServices.factoryService);
    this.editor.widget.id = 'pf-sql-editor';
    this.toolbar = new TopToolbar();

    this.addWidget(this.toolbar);
    this.addWidget(this.editor.widget);

    this.editor.widget.stateChanged.connect(this._sendSQL, this);
  }

  readonly editor: IEditor;
  readonly toolbar: Toolbar;

  /**
   * Handle update requests for the widget.
   */
  async onUpdateRequest(msg: Message): Promise<void> {
    const sessionID = sessionStorage.getItem('session_id');
    if (!sessionID) {
      const response = await Api.getFlinkSession();
      const { session_id } = response;
      sessionStorage.setItem('session_id', session_id);
    }
  }

  async onCloseRequest(msg: Message): Promise<void> {
    const sessionID = sessionStorage.getItem('session_id');
    if (sessionID) {
      await Api.closeFlinkSession(sessionID);
    }
    super.onCloseRequest(msg);
  }

  private async _sendSQL(emitter: Widget, content: string): Promise<void> {
    const response = await Api.postSQL(content);
    console.log('Data has been received from backend', response);
  }
}
