import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { InputDialog } from '@jupyterlab/apputils';
import { IStateDB } from '@jupyterlab/statedb';

import { PulsarFinkSQLWidget } from './widget';

const PLUGIN_ID = 'pulsar-flink-sql';

/**
 * Activate the Pulsar Flink SQL widget extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  state: IStateDB
): void {
  console.log('JupyterLab extension jupyterlab_pulsar_flink_sql is activated!');

  // Declare a widget variable
  let widget: PulsarFinkSQLWidget;

  // Add an application command
  const command = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Pulsar Fink SQL',
    execute: async () => {
      const PulsarCloudAuth = sessionStorage.getItem('pulsar_cloud_auth');
      if (
        PulsarCloudAuth === 'null' ||
        PulsarCloudAuth === 'undefined' ||
        !PulsarCloudAuth
      ) {
        const result = await InputDialog.getText({
          title: 'Input a auth token for pulsar cloud'
        });
        sessionStorage.setItem('pulsar_cloud_auth', result.value);
      }

      if (!widget || widget.isDisposed) {
        // Create a new widget if one does not exist
        // or if the previous one was disposed after closing the panel
        widget = new PulsarFinkSQLWidget();
        widget.id = 'pf-sql';
        widget.title.label = 'Pulsar Fink SQL';
        widget.title.closable = true;
      }

      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }

      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }

      // Activate the widget
      app.shell.add(widget);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Pulsar' });

  // Track and restore the widget state
  const tracker = new WidgetTracker<PulsarFinkSQLWidget>({
    namespace: 'pulsar'
  });
  restorer.restore(tracker, {
    command,
    name: () => 'pulsar'
  });
}

/**
 * Initialization data for the pulsar-flink-sql extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, IStateDB],
  activate: activate
};

export default extension;
