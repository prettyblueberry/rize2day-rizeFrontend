import { useEffect, useState } from "react";
import MyRouter from "routers/index";
import { io } from 'socket.io-client';
import { config } from "app/config";

export const socket = io(`${config.socketUrl}`);

function App() {
  const [mode, setMode] = useState("dark");
  useEffect(() => {
    if (localStorage.theme === undefined || localStorage.theme === null) {
      toDark();
    }
    else if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      toDark();
    } else {
      toLight();
    }
  }, []);

  const toDark = () => {
    const root = document.querySelector("html");
    if (!root) return;
    !root.classList.contains("dark") && root.classList.add("dark");
    localStorage.theme = "dark";
    setMode("dark");
  };

  const toLight = () => {
    const root = document.querySelector("html");
    if (!root) return;
    root.classList.remove("dark");
    localStorage.theme = "light";
    setMode("light");
  };

  return (
    <div className="bg-white text-base dark:bg-[#191818] text-neutral-900 dark:text-neutral-200">
      <MyRouter mode={mode} />
    </div>
  );
}

export default App;
