import { app, BrowserWindow, Menu } from "electron";
import path from "path";

let mainWindow: BrowserWindow;
let preferencesWindow: BrowserWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Cosmonaut",
    width: 800,
    height: 800
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js")
    // }
  });

  mainWindow.loadFile(path.join(__dirname, "../src/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menu: any = [
    {
      label: "Application",
      submenu: [
        {
          label: "Preferences",
          click: () => {
            createPreferencesWindow();
          }
        },
        {
          type: "separator"
        },
        {
          label: "Quit Cosmonaut",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
};

const createPreferencesWindow = () => {
  if (preferencesWindow) {
    preferencesWindow.focus();

    return;
  }

  preferencesWindow = new BrowserWindow({
    title: "Preferences",
    width: 400,
    height: 400,
    resizable: false
  });

  preferencesWindow.loadFile(path.join(__dirname, "../src/preferences.html"));

  preferencesWindow.on("closed", () => {
    preferencesWindow = null;
  });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
