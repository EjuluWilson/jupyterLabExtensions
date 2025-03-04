import { JupyterFrontEnd, JupyterFrontEndPlugin } from "@jupyterlab/application";
import { AppWidget } from "./widgets/AppWidget";

const extension: JupyterFrontEndPlugin<void> = {
  id: "my-react-extension",
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log("JupyterLab React Extension is activated!");

    // ✅ Create an instance of the React-based widget
    const widget = new AppWidget();
    widget.id = "react-app";
    widget.title.label = "React App";
    widget.title.closable = true;

    // ✅ Add the widget to the JupyterLab sidebar
    app.shell.add(widget, "left");
  },
};

export default extension;
