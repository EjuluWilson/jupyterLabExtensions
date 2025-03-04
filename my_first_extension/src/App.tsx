import React from "react";
import { JupyterFrontEnd } from "@jupyterlab/application"; // Gives access to JupyterLab’s application instance, needed for notebook interactions.

// NotebookActions provides static methods to manipulate cells (insert, delete, run).
// INotebookTracker is used to track the active notebook.
import { NotebookActions, INotebookTracker } from "@jupyterlab/notebook";

interface Props {
  app: JupyterFrontEnd;
  notebookTracker: INotebookTracker;
}

function App({ app, notebookTracker }: Props) {
  // Get the active notebook
  function getActiveNotebook() {
    return notebookTracker.currentWidget?.content || null;
  }

  // Insert a new cell below the active cell
  function insertNewCell() {
    const notebook = getActiveNotebook();
    if (notebook) {
      NotebookActions.insertBelow(notebook);
    }
  }

  // Run the selected cell
  function runCell() {
    const notebookPanel = notebookTracker.currentWidget;
    if (notebookPanel) {
      const notebook = notebookPanel.content;
      NotebookActions.run(notebook, notebookPanel.sessionContext);
    }
  }

  // Delete the selected cell
  function deleteCell() {
    const notebook = getActiveNotebook();
    if (notebook) {
      NotebookActions.deleteCells(notebook);
    }
  }

  return (
    <div style={{ padding: "10px", backgroundColor: "#f4f4f4", fontSize: "14px" }}>
      <h2>Notebook Controls</h2>
      <button onClick={insertNewCell}>➕ Add Cell</button>
      <button onClick={runCell}>▶️ Run Cell</button>
      <button onClick={deleteCell}>🗑️ Delete Cell</button>
    </div>
  );
}

export default App;
