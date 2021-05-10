import { Message } from '@lumino/messaging';

import { BoxPanel, Widget } from '@lumino/widgets';
import { Toolbar, showErrorMessage } from '@jupyterlab/apputils';
import { editorServices } from '@jupyterlab/codemirror';

import { Editor, IEditor } from './editor';
import { TopToolbar } from './toolbar';
import { DataGridPanel } from './grid';
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
    this.dataView = new DataGridPanel();

    this.addWidget(this.toolbar);
    this.addWidget(this.editor.widget);
    this.addWidget(this.dataView);

    this.editor.widget.stateChanged.connect(this._sendSQL, this);
  }

  readonly editor: IEditor;
  readonly toolbar: Toolbar;
  readonly dataView: DataGridPanel;

  /**
   * Handle update requests for the widget.
   */
  async onUpdateRequest(msg: Message): Promise<void> {
    const sessionID = sessionStorage.getItem('session_id');
    if (sessionID === 'undefined' || sessionID === 'null' || !sessionID) {
      const response = await Api.getFlinkSession();
      const { session_id } = response;
      sessionStorage.setItem('session_id', session_id);
    }
  }

  async onCloseRequest(msg: Message): Promise<void> {
    await this._clearSessionAndJob();
    super.onCloseRequest(msg);
  }

  private async _sendSQL(emitter: Widget, content: string): Promise<void> {
    const sessionID = sessionStorage.getItem('session_id');
    await this._clearJob(sessionID);

    const response = await Api.postSQL(content);
    if (response.kind === 'error') {
      await showErrorMessage('Message', response.errors[0]);
      return;
    }

    if (response.statement_types.includes('SELECT')) {
      const jobID = response.results[0].data[0][0];
      sessionStorage.setItem('job_id', jobID);

      const token = 0;
      const res = await Api.getDataFromJob(jobID, token);
      this.dataView.data = res.results[0];
      this._jobCallback(res.next_result_uri);
    } else {
      this.dataView.data = response.results[0];
    }
  }

  private async _clearJob(sessionID: string) {
    const jobID = sessionStorage.getItem('job_id');
    if (sessionID && jobID) {
      await Api.closeFlinkJob(sessionID, jobID);
      sessionStorage.removeItem('job_id');
    }
  }

  private async _clearSessionAndJob() {
    const sessionID = sessionStorage.getItem('session_id');
    if (sessionID) {
      await this._clearJob(sessionID);
      await Api.closeFlinkSession(sessionID);
      sessionStorage.removeItem('session_id');
    }
  }

  private async _jobCallback(nextUrl: string) {
    const response = await Api.getDataFromJob(nextUrl);
    const { data } = response.results[0];
    const dataCompose = this.dataView.data.data.concat(data);
    this.dataView.data = {
      columns: this.dataView.data.columns,
      data: dataCompose
    };
    setTimeout(async () => this._jobCallback(response.next_result_uri), 5000);
  }
}
