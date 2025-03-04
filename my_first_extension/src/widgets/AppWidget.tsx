import { ReactWidget } from "@jupyterlab/apputils";
import React from "react";
import App from "../App"; // Import the React App component

export class AppWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass("my-react-app-widget"); // Optional CSS class
  }

  render(): JSX.Element {
    return <App />; // Render the React App inside JupyterLab
  }
}
