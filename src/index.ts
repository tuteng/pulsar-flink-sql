import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the pulsar-flink-sql extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pulsar-flink-sql:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension pulsar-flink-sql is activated!');
  }
};

export default extension;
