import { app, BrowserWindow, Menu } from "electron";
import fs from "fs";

let mainWindow: BrowserWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    title: "Cosmonaut",
    width: 1024,
    height: 768,
    resizable: true
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js")
    // }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menu: any = [
    {
      label: "Application",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: (_: any, window: BrowserWindow) => {
            window.reload();
          }
        },
        {
          type: "separator"
        },
        {
          label: "Close Window",
          accelerator: "CmdOrCtrl+W",
          click: (_: any, window: BrowserWindow) => {
            window.close();
          }
        },
        {
          label: "Quit Cosmonaut",
          accelerator: "CmdOrCtrl+Q",
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
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Toggle Developer Tools",
          accelerator: "CmdOrCtrl+I",
          role: "toggleDevTools"
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

  // mainWindow.webContents.toggleDevTools();
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

fs.watch("./dist", (_event: string, filename: string) => {
  if (filename === "index.js") {
    mainWindow.reload();
  }
});
