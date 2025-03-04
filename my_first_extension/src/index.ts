// src/index.ts

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ICommandPalette } from '@jupyterlab/apputils';
import { AppWidget } from './widgets/AppWidget';

/**
 * Import styles
 */
import '../style/base.css';

/**
 * The command ID used to open our widget
 */
const COMMAND_ID = 'react-cell-operations:open';

/**
 * Initialization data for the cell operations extension
 * This configures our extension as a JupyterLab plugin
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'react-cell-operations:plugin',
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    notebookTracker: INotebookTracker
  ) => {
    console.log('JupyterLab Cell Operations Extension is activated!');

    /**
     * Create and track an instance of our widget
     */
    let widget: AppWidget;

    /**
     * Add a command to the palette
     */
    app.commands.addCommand(COMMAND_ID, {
      label: 'Open Cell Operations',
      execute: () => {
        // If the widget doesn't exist or is disposed, create a new one
        if (!widget || widget.isDisposed) {
          // Create the widget
          widget = new AppWidget(notebookTracker);
        }

        // If the widget is not in the main area, add it
        if (!widget.isAttached) {
          // Attach the widget to the main area
          app.shell.add(widget, 'left');
        }
        
        // Activate the widget (focus it)
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette
    palette.addItem({ command: COMMAND_ID, category: 'Notebook Operations' });
  }
};

export default plugin;