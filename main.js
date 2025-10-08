const { app, BrowserWindow, globalShortcut } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 320,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,   // must
      contextIsolation: false, // must for Next.js dev
    },
  });

setTimeout(() => {
  mainWindow.loadURL("http://localhost:3000");
}, 2000); 
  mainWindow.hide();
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("Control+Shift+A", () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
