// src/App.tsx

import React, { useState, useEffect } from 'react';
import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookActions } from '@jupyterlab/notebook';

// Define props interface for our component
interface AppProps {
  // We'll need the current notebook to operate on
  notebookPanel: NotebookPanel | null;
}

/**
 * Main application component for cell operations
 * This component provides a UI for performing CRUD operations on notebook cells
 */
const App: React.FC<AppProps> = ({ notebookPanel }) => {
  // State to store cell content for editing
  const [cellContent, setCellContent] = useState<string>('');
  // State to track the index of the current cell
  const [currentCellIndex, setCurrentCellIndex] = useState<number>(0);
  // State to track total cell count
  const [cellCount, setCellCount] = useState<number>(0);
  // State to track cell type for display
  const [cellType, setCellType] = useState<string>('');

  // Update the cell count and content whenever the notebook changes
  useEffect(() => {
    if (notebookPanel) {
      // Update cell count
      const count = notebookPanel.content.widgets.length;
      setCellCount(count);
      
      // If we have cells, get the content of the current cell
      if (count > 0 && currentCellIndex < count) {
        const cell = notebookPanel.content.widgets[currentCellIndex];
        
        // Get the cell's content using the appropriate method based on the current API
        const model = cell.model;
        setCellContent(model.sharedModel.getSource());
        
        // Update the cell type
        setCellType(model.type);
      } else if (count > 0) {
        // If currentCellIndex is out of bounds, reset it
        setCurrentCellIndex(0);
      }
    }
  }, [notebookPanel, currentCellIndex]);

  /**
   * Create a new cell at the current position
   */
  const handleCreateCell = () => {
    if (!notebookPanel) return;
    
    // Get the notebook model
    const model = notebookPanel.model;
    if (!model) return;
    
    // Insert a new code cell at the current index
    model.sharedModel.insertCell(
      currentCellIndex,
      {
        cell_type: 'code',
        source: '# New cell created with React UI',
        metadata: {},
        // For code cells
        execution_count: null,
        outputs: []
      }
    );
    
    // Update cell count
    setCellCount(notebookPanel.content.widgets.length);
  };

  /**
   * Read the content of a specific cell
   */
  const handleReadCell = (index: number) => {
    if (!notebookPanel || index < 0 || index >= cellCount) return;
    
    // Update the current cell index
    setCurrentCellIndex(index);
    
    // Get the cell content (done via the useEffect that reacts to currentCellIndex changes)
  };

  /**
   * Update the current cell with new content
   */
  const handleUpdateCell = () => {
    if (!notebookPanel || currentCellIndex < 0 || currentCellIndex >= cellCount) return;
    
    // Get the cell model
    const cell = notebookPanel.content.widgets[currentCellIndex];
    const model = cell.model;
    
    // Update the cell content
    model.sharedModel.setSource(cellContent);
  };

  /**
   * Delete the current cell
   */
  const handleDeleteCell = () => {
    if (!notebookPanel || currentCellIndex < 0 || currentCellIndex >= cellCount) return;
    
    // Get the notebook model
    const model = notebookPanel.model;
    if (!model) return;
    
    // Delete the cell
    model.sharedModel.deleteCell(currentCellIndex);
    
    // Update cell count
    setCellCount(notebookPanel.content.widgets.length);
    
    // Adjust current cell index if needed
    if (currentCellIndex >= notebookPanel.content.widgets.length) {
      setCurrentCellIndex(Math.max(0, notebookPanel.content.widgets.length - 1));
    }
  };

    /**
     * Execute the current cell
     */
    const handleExecuteCell = () => {
        if (!notebookPanel || currentCellIndex < 0 || currentCellIndex >= cellCount) return;
        
        // Get the cell
        const cell = notebookPanel.content.widgets[currentCellIndex];
        
        // Make sure it's a code cell
        if (cell.model.type !== 'code') {
        alert('Can only execute code cells');
        return;
        }
        
        // Activate the cell
        notebookPanel.content.activeCellIndex = currentCellIndex;
        
        // Execute the cell using NotebookActions
        NotebookActions.run(notebookPanel.content, notebookPanel.sessionContext);
    };

  // If no notebook is provided, show a message
  if (!notebookPanel) {
    return <div className="no-notebook">No notebook is currently active. Please open a notebook.</div>;
  }

  return (
    <div className="cell-editor-container">
      <h3>Notebook Cell Operations</h3>
      
      {/* Display current cell info */}
      <div className="cell-info">
        {cellCount > 0 ? (
          <p>Current cell: {currentCellIndex + 1} of {cellCount} (Type: {cellType})</p>
        ) : (
          <p>No cells in notebook</p>
        )}
      </div>
      
      {/* Cell navigation */}
      <div className="cell-navigation">
        <button 
          onClick={() => handleReadCell(currentCellIndex - 1)}
          disabled={currentCellIndex <= 0}
        >
          Previous Cell
        </button>
        
        <button 
          onClick={() => handleReadCell(currentCellIndex + 1)}
          disabled={currentCellIndex >= cellCount - 1}
        >
          Next Cell
        </button>
      </div>
      
      {/* Cell content editor */}
      <div className="cell-editor">
        <textarea 
          value={cellContent} 
          onChange={(e) => setCellContent(e.target.value)}
          rows={10}
          placeholder="Cell content goes here..."
        />
      </div>
      
      {/* CRUD operations */}
      <div className="cell-operations">
        <button onClick={handleCreateCell}>Create Cell</button>
        <button onClick={handleUpdateCell}>Update Cell</button>
        <button onClick={handleDeleteCell}>Delete Cell</button>
        <button onClick={handleExecuteCell}>Execute Cell</button>
      </div>
    </div>
  );
};

export default App;