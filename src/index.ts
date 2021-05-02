import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';

import { PulsarFinkSQLWidget } from './widget';

/**
 * Activate the Pulsar Flink SQL widget extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer
): void {
  console.log('JupyterLab extension jupyterlab_pulsar_flink_sql is activated!');

  // Declare a widget variable
  let widget: PulsarFinkSQLWidget;

  // Add an application command
  const command = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Pulsar Fink SQL',
    execute: () => {
      if (!widget || widget.isDisposed) {
        // Create a new widget if one does not exist
        // or if the previous one was disposed after closing the panel
        widget = new PulsarFinkSQLWidget();
        widget.id = 'pulsar-flink-sql';
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
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
<<<<<<< HEAD
  const tracker = new WidgetTracker<PulsarFinkSQLWidget>({
    namespace: 'pulsar'
=======
  const tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
    namespace: 'apod'
>>>>>>> 3e8cd75 (Fix code format)
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
  id: 'pulsar-flink-sql',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
