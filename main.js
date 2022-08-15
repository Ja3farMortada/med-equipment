const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// require keys
const keys = require('./keys.json');

// require server
const server = require('./server');

// Check if electron is in development mode to enable Node.js on release mode 
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
if (!isDev) {
    var node = server.listen(keys.port, () => console.log(`listening on port ${keys.port} ...`));
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
  win.show()

  win.loadFile('app/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (!isDev) {
        node.close();
    }
    app.quit()
  }
})


ipcMain.on('backupDB', () => {
    dialog.showSaveDialog({
        defaultPath: 'med-equipment.sql',
        properties: ['dontAddToRecent']
    }).then(function (data) {
        if (data.canceled == false) {
            mysqldump({
                connection: {
                    host: keys.host,
                    user: keys.username,
                    password: keys.password,
                    database: keys.database
                },
                dumpToFile: `${data.filePath}`
            }).then(function () {
                win.webContents.send('backup-success')
            }, function (error) {
                win.webContents.send('backup-error')
            })
        }
    })
});
