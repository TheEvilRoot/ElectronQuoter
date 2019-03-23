const { app, BrowserWindow } = require('electron')
const nativeImage = require('electron').nativeImage;
require('electron-reload')(__dirname);

var image = nativeImage.createFromPath(__dirname + "/assets/mac-64x64.png");
image.setTemplateImage(true)

let win;

function createWindow () {
  win = new BrowserWindow({ 
    width: 800,
    height: 600,
    minWidth: 300,
    minHeight: 500,
    titleBarStyle: process.platform == "darwin" ? "hidden" : "default",
    icon: image
  });
  console.log(image, win);
  win.loadFile('app/index.html');

  win.on('closed', () => {
    win = null;
  });
  win.setMenu(null);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
