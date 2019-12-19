import { app, BrowserWindow } from "electron";
import path from "path";

let window: BrowserWindow;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 800
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js")
    // }
  });

  window.loadFile(path.join(__dirname, "../index.html"));

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});
