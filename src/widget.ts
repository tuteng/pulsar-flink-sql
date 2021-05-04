import { Message } from '@lumino/messaging';

import { BoxPanel, Widget } from '@lumino/widgets';
import { editorServices } from '@jupyterlab/codemirror';

import { Editor, IEditor } from './editor';
import { Api } from './services';

export class PulsarFinkSQLWidget extends BoxPanel {
  /**
   * Construct a new SQL widget.
   */
  constructor() {
    super();

    this.addClass('pulsar-flink-sql-widget');

    this.editor = new Editor('', editorServices.factoryService);
    this.editor.widget.id = 'pulsar-flink-sql-editor';

    this.addWidget(this.editor.widget);
    this.editor.widget.stateChanged.connect(this._send_sql, this);
  }

  readonly editor: IEditor;

  /**
   * Handle update requests for the widget.
   */
  async onUpdateRequest(msg: Message): Promise<void> {
    const response = await Api.getFlinkSession();
    const { session_id } = response;
    sessionStorage.setItem('session_id', session_id);
  }

  private async _send_sql(emitter: Widget, content: string): Promise<void> {
    const response = await Api.postSQL(content);
    console.log('Data has been received from backend', response);
  }
}
