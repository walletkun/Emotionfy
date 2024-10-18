import { useState, useEffect } from "react";
import axios from "axios";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [userArray, setUserArray] = useState([]);

  const fecthAPI = async () => {
    const response = await axios.get("http://localhost:8000/api/users");
    console.log(response.data.users);
    setUserArray(response.data.users);
  };

  useEffect(() => {
    fecthAPI();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        {userArray.map((user, index) => (
          <span key={index}>
            <h2>{user}</h2>
          </span>
        ))}
      </p>
    </>
  );
}

export default App;
