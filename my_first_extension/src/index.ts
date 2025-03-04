// src/index.ts
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConversationPanel } from './components/ConversationPanel';

/**
 * A widget that hosts our React component
 */
class ReactWidget extends Widget {
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }

  render(): void {
    ReactDOM.render(React.createElement(ConversationPanel), this.node);
  }

  onAfterAttach(): void {
    this.render();
  }

  onBeforeDetach(): void {
    // Clean up React when widget is removed
    ReactDOM.unmountComponentAtNode(this.node);
  }
}

/**
 * Activate function to initialize and add the widget
 */
function activate(app: JupyterFrontEnd, palette: ICommandPalette) {
  console.log('Conversational notebook assistant UI activated!');

  // Create the React widget
  const conversationWidget = new ReactWidget();
  conversationWidget.id = 'conversation-widget';
  conversationWidget.title.iconClass = 'jp-ChatIcon'; // Make sure this icon exists
  conversationWidget.title.caption = 'Notebook Assistant';

  // Add widget to the left sidebar
  app.shell.add(conversationWidget, 'left', { rank: 500 });

  // Add a command to activate the widget
  const command = 'conversation:open';
  app.commands.addCommand(command, {
    label: 'Open Notebook Assistant',
    execute: () => {
      app.shell.activateById(conversationWidget.id);
    }
  });

  palette.addItem({ command, category: 'Assistant' });
}

/**
 * Plugin registration information
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-conversation-ui',
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
};

export default plugin;