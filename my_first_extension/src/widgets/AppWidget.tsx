// src/widgets/AppWidget.ts

import { Widget } from '@lumino/widgets';
import { INotebookTracker } from '@jupyterlab/notebook';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../App';

/**
 * A Lumino widget that hosts our React Cell Operations UI
 * This serves as a container/bridge between JupyterLab and our React component
 */
export class AppWidget extends Widget {
  /**
   * Reference to the notebook tracker to access the current notebook
   */
  private notebookTracker: INotebookTracker;

  /**
   * Constructor for our widget
   * @param notebookTracker - Service to track the current notebook
   */
  constructor(notebookTracker: INotebookTracker) {
    super();
    this.notebookTracker = notebookTracker;
    
    // Add a CSS class for styling
    this.addClass('jp-ReactApp');
    
    // Set a unique ID for this widget
    this.id = 'cell-operations-react-widget';
    
    // Configure the widget's title (shown in tabs, etc)
    this.title.label = 'Cell Operations';
    this.title.closable = true;
    
    // Setup change tracking for the active notebook
    this.notebookTracker.currentChanged.connect(this.onActiveNotebookChanged, this);
    
    // Also listen for changes to the current notebook's content
    this.notebookTracker.activeCellChanged.connect(this.onActiveCellChanged, this);
  }

  /**
   * Handler for when the active notebook changes
   * Forces a re-render of our React component
   */
  private onActiveNotebookChanged(): void {
    // If the widget is attached to the DOM, re-render
    if (this.isAttached) {
      this.update();
    }
  }

  /**
   * Handler for when the active cell changes in the current notebook
   * Forces a re-render of our React component
   */
  private onActiveCellChanged(): void {
    // If the widget is attached to the DOM, re-render
    if (this.isAttached) {
      this.update();
    }
  }

  /**
   * Called when the widget is attached to the DOM
   * This is the perfect time to render our React component
   */
  onAfterAttach(): void {
    // Render the React component into this widget's node
    this.renderComponent();
  }

  /**
   * Called when the widget needs to update
   * We'll use this to re-render our React component
   */
  onUpdateRequest(): void {
    // Update the React component
    this.renderComponent();
  }

  /**
   * Called just before the widget is detached from the DOM
   * This is the perfect time to clean up React
   */
  onBeforeDetach(): void {
    // Unmount the React component to prevent memory leaks
    ReactDOM.unmountComponentAtNode(this.node);
  }

  /**
   * Helper method to render our React component
   * Gets the current notebook and passes it to our App component
   */
  private renderComponent(): void {
    // Get the current notebook
    const currentNotebook = this.notebookTracker.currentWidget;
    
    // Render our React component with the current notebook
    ReactDOM.render(
      // Create a React element using our App component
      React.createElement(App, {
        notebookPanel: currentNotebook
      }),
      this.node
    );
  }
}