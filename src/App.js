import Scanner from "./Scanner";
import React from "react";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Scanner />
    </div>
  );
}

export default App;
