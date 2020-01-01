import { app, BrowserWindow, Menu } from "electron";

let mainWindow: BrowserWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Cosmonaut",
    width: 800,
    height: 800
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
