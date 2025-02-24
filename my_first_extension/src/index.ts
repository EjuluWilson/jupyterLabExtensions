import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';


// APOD Response structure
interface APODResponse {
  copyright: string;
  date: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
};

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-apod',
  description: 'Show a random NASA Astronomy Picture in a panel.',
  autoStart: true,
  requires: [ICommandPalette],
  
  // Activate is called by JupyterLab when your extension loads
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette) => {
    
    // Initial widget creation
    let widget = await newWidget();

    // Define a unique command identifier
    const command: string = 'apod:open';

    // Add a new command to JupyterLab
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',

      // This is called whenever the command is triggered
      execute: async () => {
        // If widget is closed, recreate it
        if (widget.isDisposed) {
          widget = await newWidget();
        }
        
        // Add the widget to the main area if not already there
        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }

        // Focus (activate) the widget's tab
        app.shell.activateById(widget.id);
      }
    });

    // Add this command to the command palette under "Tutorial"
    palette.addItem({ command, category: 'Tutorial' });
  }
};

// Async widget creation function (for fetching images)
const newWidget = async () => {
  
  // Create a simple container for holding content
  const content = new Widget();

  // Embed our simple container widget within a MainAreaWidget
  const widget = new MainAreaWidget({ content });
  
  widget.id = 'apod-jupyterlab';
  widget.title.label = 'Astronomy Picture';
  widget.title.closable = true;

  // ---- NOW, new code is placed here (image handling) ----

  // Create an HTML <img> element to display the APOD image
  let img = document.createElement('img');

  // Set some basic styling for the image
  img.style.maxWidth = '100%';  // Image won't overflow container
  img.style.display = 'block';  // Predictable display behavior

  // Add the img element to the Widget's DOM node
  content.node.appendChild(img);

  // Helper function to generate a random date
  function randomDate() {
    const start = new Date(2010, 1, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
    return randomDate.toISOString().slice(0, 10);
  }

  // Fetch random image data from NASA's APOD API
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`
  );
  const data = await response.json() as APODResponse;

  // If NASA provides an image, set its src and title
  if (data.media_type === 'image') {
    img.src = data.url;
    img.title = data.title;
  } else {
    // Fallback text if API returns a video instead
    img.alt = 'Today\'s APOD is a video. Try again!';
  }

  // ---- End of new code (image handling) ----

  return widget;
};

export default plugin;
