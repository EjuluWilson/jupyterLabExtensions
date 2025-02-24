import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

/**
 * A simple conversational sidebar widget for JupyterLab.
 */
class ConversationWidget extends Widget {
  inputNode: HTMLInputElement;
  buttonNode: HTMLButtonElement;
  outputNode: HTMLDivElement;

  constructor() {
    super();
    this.addClass('jp-ConversationWidget');

    // Create output container
    this.outputNode = document.createElement('div');
    this.outputNode.className = 'jp-ConversationOutput';
    this.node.appendChild(this.outputNode);

    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'jp-ConversationInputContainer';

    this.inputNode = document.createElement('input');
    this.inputNode.type = 'text';
    this.inputNode.placeholder = 'Ask a question...';
    this.inputNode.className = 'jp-ConversationInput';

    this.buttonNode = document.createElement('button');
    this.buttonNode.textContent = 'Send';
    this.buttonNode.className = 'jp-ConversationButton';

    inputContainer.appendChild(this.inputNode);
    inputContainer.appendChild(this.buttonNode);
    this.node.appendChild(inputContainer);

    // Bind event listeners
    this.buttonNode.onclick = () => this.onSend();
    this.inputNode.onkeypress = (event) => {
      if (event.key === 'Enter') this.onSend();
    };
  }

  /**
   * Handles the send button click or enter key press
   */
  private onSend(): void {
    const text = this.inputNode.value.trim();
    if (!text) return;

    // Display user's input
    const userMessage = document.createElement('div');
    userMessage.className = 'jp-UserMessage';
    userMessage.textContent = `User: ${text}`;
    this.outputNode.appendChild(userMessage);

    // Simulate system response
    const systemMessage = document.createElement('div');
    systemMessage.className = 'jp-SystemMessage';
    systemMessage.textContent = `System: Received "${text}"`;
    this.outputNode.appendChild(systemMessage);

    // Scroll to bottom of output
    this.outputNode.scrollTop = this.outputNode.scrollHeight;

    // Clear input field
    this.inputNode.value = '';
  }
}

/**
 * Activate function to initialize and add the sidebar widget
 */
function activate(app: JupyterFrontEnd, palette: ICommandPalette) {
  console.log('Conversational notebook assistant UI activated!');

  const conversationWidget = new ConversationWidget();
  conversationWidget.id = 'conversation-widget';
  conversationWidget.title.iconClass = 'jp-ChatIcon';
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
