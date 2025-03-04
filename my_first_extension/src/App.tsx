import React, { useState } from "react";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "10px", fontSize: "16px", backgroundColor: "#f4f4f4" }}>
      <h2>JupyterLab React App</h2>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default App;
